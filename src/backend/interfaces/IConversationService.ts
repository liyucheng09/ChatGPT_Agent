import GameContext from "../../frontend/engine/GameContext";


export interface IHistory {
  readonly playerStepsTaken?: number;
  readonly msg: string;
}

// TODO change to entity?
export interface IConversationModel {
  readonly isActive: boolean;
  readonly history: IHistory[]; // TODO will run into conversation limits currently, need to further nest this history
  readonly messages: IMessageModel[];
}

export type ResponseActionType = 'farewell' | 'move' | 'reply';

// TODO change to entity
export interface IMessageModel {
  readonly id: number;
  readonly text: string;
  readonly sender: 'me' | 'npc';
  readonly fullText: string;
  readonly errorMessage: string | undefined;
  readonly action?: ResponseActionType;
}

export default interface IConversationService {

  // start end

  // get conversation (conversationId)

  // end conversation

  // respond -> comes back with stream of what chat gpt is saying, which service then wraps into its own stream
  // and records once finished, but sends the ongoing stream back to the user.
  // validate what the user said first

  startConversation(npcId: number, envDescription: string, gc: GameContext): Promise<IConversationModel>;
  sendReply(npcId: number, replyText: string): Promise<IConversationModel>;
  endConversation(npcId: number, endConversationText: string): Promise<IConversationModel>;
  getLocation(npcId: number, options: string[]): Promise<string | null>;
}
