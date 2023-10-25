import { GptMessage, postChatGpt } from "../../Api";
import GameContext from "../../frontend/engine/GameContext";
import { npcSharedPrompt, worldHistory, worldKnowledge } from "../data/npcs/NpcData";
import IConversationService, { IConversationModel, IHistory, IMessageModel, ResponseActionType } from "../interfaces/IConversationService";
import INpcRepo, { INpcModel } from "../interfaces/INpcRepo";
import MessageModel from "../models/MessageModel";
import NpcRepo from "../repos/NpcRepo";


type ChatNumberResponse = {
  response: string;
  value: number;
}

const actionResponses: ResponseActionType[] = ['move', 'farewell', 'reply'];

export default class ConversationService implements IConversationService {

  private roleplayCutoff = 2;

  // things like this should use dependency injection, rather than directly initializing
  // with the constructor
  private readonly _npcRepo: INpcRepo = new NpcRepo();

  public async startConversation(npcId: number, envDescription: string, gc: GameContext): Promise<IConversationModel> {
    const npc = await this._npcRepo.getById(npcId);
    const conversation = npc.conversation;
    if (conversation.isActive) throw new Error(`Conversation with ${npcId} is already active`);

    // todo, post to chatgpt and get back reponse
    const promptMsgs = this.getConversationStartPrompt(npc, envDescription, gc);
    const response = await postChatGpt(promptMsgs);

    const newMsgs: IMessageModel[] = [
      new MessageModel(0, '', 'me', promptMsgs[0].content),
      new MessageModel(1, response, 'npc', response),
    ];

    // update conversation
    const updatedConversation: IConversationModel = {
      ...conversation,
      isActive: true,
      messages: [...newMsgs],
    };

    this.saveConversation(npc, updatedConversation);

    return updatedConversation;
  }

  public async getLocation(npcId: number, options: string[]): Promise<string | null> {
    const npc = await this._npcRepo.getById(npcId);
    const conversation = npc.conversation;
    if (!conversation.isActive) throw new Error(`Conversation with ${npcId} is not active`);

    const locations = options.map((v, i) => `${i}: ${v}`).join("\n");
    const promptMsgs: GptMessage[] = [...this.mapToGptMessages(conversation), {
      role: "user",
      content: `Where do you want to go? ${locations}. (reply with just the number)`,
    }];
    const response = await postChatGpt(promptMsgs);
    const value = this.getFirstDigit(response)

    if (value === null || value < 0 || value >= options.length) {
      console.log(`Invalid location response ${response}`);
      return null;
    }

    return options[value];
  }

  public async sendReply(npcId: number, replyText: string): Promise<IConversationModel> {
    const npc = await this._npcRepo.getById(npcId);
    const conversation = npc.conversation;
    if (!conversation.isActive) throw new Error(`Conversation with ${npcId} is not active`);
    const lastId = conversation.messages[conversation.messages.length - 1].id;

    const [validation, action] = await Promise.all([
      this.validateReply(replyText, conversation),
      this.getNextAction(replyText, conversation),
    ]);

    console.log(`validation: ${validation.response}`);
    console.log(`action ${action.response}`);
    if (validation.value < this.roleplayCutoff) {
      const newMsg = new MessageModel(
        lastId + 1,
        replyText,
        'me',
        '',
        `Your message has been ignored for being unrealistic\nReason: ${validation.response}`
      );

      const updatedConversation: IConversationModel = {
        ...conversation,
        messages: [...conversation.messages, newMsg],
      };
      this.saveConversation(npc, updatedConversation);
      return updatedConversation;
    }

    const actionFollowups = ["Tell Brendan to follow you", "You say a farewell", ""]
    const promptMsgs: GptMessage[] = [...this.mapToGptMessages(conversation), {
      role: "user",
      content: `Brendan replies "${replyText}". ${actionFollowups[action.value - 1]}. (Respond with just what your character would say)`,
    }];
    const response = await postChatGpt(promptMsgs);

    const newMsgs: IMessageModel[] = [
      new MessageModel(lastId + 1, replyText, 'me', promptMsgs[promptMsgs.length - 1].content),
      new MessageModel(lastId + 2, response, 'npc', response, undefined, actionResponses[action.value - 1]),
    ];

    const updatedConversation: IConversationModel = {
      ...conversation,
      messages: [...conversation.messages, ...newMsgs],
    };
    this.saveConversation(npc, updatedConversation);

    return updatedConversation;
  }

  public async endConversation(npcId: number, endConversationText: string): Promise<IConversationModel> {
    const npc = await this._npcRepo.getById(npcId);
    const conversation = npc.conversation;
    if (!conversation.isActive) throw new Error(`There is no active conversation with ${npcId}`);

    // summarize conversation
    const summary = await this.summarizeConversation(conversation, endConversationText);

    const updatedConversation: IConversationModel = {
      isActive: false,
      history: [...conversation.history, { msg: `Conversation summary: ${summary}` }],
      messages: [],
    };

    // update conversation history and set not active
    this.saveConversation(npc, updatedConversation);
    return updatedConversation;
  }

  private saveConversation(npc: INpcModel, conversation: IConversationModel) {
    // persist
    const updatedNpc: INpcModel = {
      ...npc,
      conversation: conversation
    };
    this._npcRepo.update(updatedNpc);
  }

  private async summarizeConversation(conversation: IConversationModel, endMessage: string): Promise<string> {
    const promptMsgs: GptMessage[] = [...this.mapToGptMessages(conversation), {
      role: "user",
      content: `${endMessage}. Write a brief summary of what was just said between you and Brendan, in the 3rd person perspective. Keep it short, but detailed!`,
    }];

    // dont include the initial conversation prompt in summary?
    const response = await postChatGpt(promptMsgs.slice(0));
    console.log(`Summarized conversation as: ${response}`);
    return response;
  }

  private async validateReply(replyText: string, conversation: IConversationModel): Promise<ChatNumberResponse> {
    const promptMsgs: GptMessage[] = [...this.mapToGptMessages(conversation), {
      role: "user",
      content: `Brendan replies "${replyText}". Does his response make sense. On this scale of 1 to 5, 
                1: Response is non-sensical,
                2: Response is immersion breaking or meta and acknowledging this is a game,
                3. Reponse is bad, unnecessarily vulgar for no reason based on the past conversation
                4: Response is all right, and something someone might say but unlikely,
                5: Response is good and mostly in context of the game world,
        how would you rate the response, give a one sentence reason why`,
    }];
    const response = await postChatGpt(promptMsgs);
    const value = this.getFirstDigit(response)

    if (!value || value < 1 || value > 5) throw new Error(`Invalid response from chatGPT: ${response}`);
    return { response, value };
  }

  private async getNextAction(replyText: string, conversation: IConversationModel): Promise<ChatNumberResponse> {
    const promptMsgs: GptMessage[] = [...this.mapToGptMessages(conversation), {
      role: "user",
      content: `Brendan replies "${replyText}". What would you like to do?
                1: tell Brendan to follow you,
                2: say a farewell,
                3: continue the current conversation,
        Pick an action from the list above. respond with just the number for the action`,
    }];
    const response = await postChatGpt(promptMsgs);
    const value = this.getFirstDigit(response)

    if (!value || value < 1 || value > 3) throw new Error(`Invalid response from chatGPT: ${response}`);
    return { response, value };
  }

  private mapToGptMessages(conversation: IConversationModel): GptMessage[] {
    return conversation.messages
      .filter(msg => !msg.errorMessage) // filter out any error messages
      .map(msg => ({
        role: msg.sender === "me" ? "user" : "assistant",
        content: msg.fullText,
      }));
  }

  private getConversationStartPrompt(npc: INpcModel, envDescription: string, gc: GameContext): GptMessage[] {
    const generalContent = npcSharedPrompt + worldHistory + worldKnowledge;

    const history = npc.conversation.history;
    let storySoFar = "";
    for (var i = 0; i < history.length; i++) {
      storySoFar += `${this.getTimeStringDelta(history, i)} ${history[i].msg}`;
    }

    // let history = npc.conversation.history
    //   .map((v, i) => `Conversation ${i + 1} summary: ${v.msg}`)
    //   .join(" ");

    const personalContent = ` Your name is ${npc.name}, ${npc.age} years old, you have the personality of a ${npc.starSign}. 
      You have ${npc.money} fictional dollars. ${npc.personalHistory} ${npc.personalKnowledge} 
      ${storySoFar}
      `;
    // You've had ${npc.conversation.history.length} conversations with Brendan recently. ${history}

    const previousSteps = this.lastStepsRecorded(history);
    let timeMsg = "";
    let walksUp = true;
    if (previousSteps) {
      timeMsg = this.stepDeltaToTimeMsg(gc.playerStepsTaken - previousSteps);
      if (gc.playerStepsTaken - previousSteps < 100) walksUp = false;
    }
    // ${walksUp ? "Brendan walks up to you" : ""}

    const prompt = ` ${timeMsg} at ${envDescription}, What would ${npc.name} say to Brendan? (Keep the response short and just the words your character says)`
    const fullPrompt = generalContent + personalContent + prompt;
    console.log(fullPrompt);
    return [{
      role: "user",
      content: fullPrompt,
    }];
  }

  private getFirstDigit(str: string): number | null {
    const match = str.match(/\d/);
    if (match) {
      return parseInt(match[0], 10);
    }
    return null;
  }

  private lastStepsRecorded(history: IHistory[]): number | null {
    for (var i = history.length - 1; i >= 0; i--) {
      const steps = history[i].playerStepsTaken
      if (steps) {
        return steps;
      }
    }
    return null;
  }

  private getTimeStringDelta(history: IHistory[], index: number): string {
    if (index === 0) return " What has happened so far: ";
    if (!history[index].playerStepsTaken) return "";

    let delta = 0;
    for (var i = index - 1; i >= 0; i--) {
      if (history[i].playerStepsTaken) {
        delta = history[index].playerStepsTaken! - history[i].playerStepsTaken!;
        break;
      }
    }
    return this.stepDeltaToTimeMsg(delta);
  }

  private stepDeltaToTimeMsg(delta: number | null): string {
    if (delta === null || delta === undefined) return "";
    if (delta <= 30) return " Now ";
    if (delta <= 100) return " A few moments later ";
    if (delta <= 300) return " Later that day ";
    if (delta <= 600) return " The next day ";
    if (delta <= 900) return " A couple days later ";
    if (delta <= 1500) return " A few days later ";
    if (delta <= 3000) return " Many days later ";
    if (delta <= 10000) return " Weeks later ";
    // if (delta <= 3) return " Then ";
    // if (delta <= 10) return " A few moments later ";
    // if (delta <= 30) return " Later that day ";
    // if (delta <= 60) return " The next day ";
    // if (delta <= 90) return " A couple days later ";
    // if (delta <= 150) return " A few days later ";
    // if (delta <= 300) return " Many days later ";
    // if (delta <= 1000) return " Weeks later ";
    return " Months later ";
  }

}