import { IConversationModel, IHistory, IMessageModel } from "../interfaces/IConversationService";

export default class ConversationModel implements IConversationModel {
  isActive: boolean = false;
  history: IHistory[] = [];
  messages: IMessageModel[] = [];
}
