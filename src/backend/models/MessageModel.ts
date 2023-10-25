import { ResponseActionType } from "../interfaces/IConversationService";

export default class MessageModel {

  constructor(
    public readonly id: number,
    public readonly text: string,
    public readonly sender: 'me' | 'npc',
    public readonly fullText: string,
    public readonly errorMessage: string | undefined = undefined,
    public readonly action: ResponseActionType | undefined = undefined,
  ) { }
}