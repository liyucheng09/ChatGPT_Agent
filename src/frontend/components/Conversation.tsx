import React, { useEffect, useRef, useState } from 'react';
import '../styles/components/Conversation.css';
import { IConversationModel, ResponseActionType } from '../../backend/interfaces/IConversationService';
import { GameState } from './Game';
import LoadingIndicator, { LoadingSpinner } from './LoadingIndicator';
import ConversationService from '../../backend/services/ConversationService';
import CAgent from '../engine/comps/CAgent';
import locationData, { locationContext } from '../../backend/data/locationData';
import LocationService from '../../backend/services/LocationService';
import { townLocation } from '../../assets/collision/townLocation';
import CGridCollider from '../engine/comps/CGridCollider';
import npcData from '../../backend/data/npcs/NpcData';

interface MessageViewModel {
  id: number | string;
  text: string;
  sender: 'me' | 'other' | 'system';
}

const mapConversationToMessages = (conversation: IConversationModel): MessageViewModel[] => {
  const vms: MessageViewModel[] = [];
  conversation.messages.forEach(msg => {
    vms.push({
      id: msg.id,
      text: msg.text,
      sender: msg.sender === "me" ? "me" : "other",
    });

    if (msg.errorMessage) {
      vms.push({
        id: `error_${msg.id}`,
        text: msg.errorMessage,
        sender: "system",
      })
    }
  });
  return vms;
}

export interface ConversationProps {
  maxHeight?: number;
  minHeight?: number;
  gameState?: GameState;
  conversationWithEntId?: number;
}

const conversationService = new ConversationService();
const locationService = new LocationService(locationContext, townLocation);

const Conversation: React.FC<ConversationProps> = (props: ConversationProps) => {
  const [messages, setMessages] = useState<MessageViewModel[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [conversationOverEndState, setConversationOverEndState] = useState<string|null>(null);
  const messagesDivRef = useRef<HTMLDivElement>(null);

  const activeAgent = props.conversationWithEntId 
    ? props.gameState?.ecs.getComponent(props.conversationWithEntId, CAgent)
    : null;
  const activeConversationAgentId = activeAgent?.agentId;

  const dimensionStyle: any = {};
  // if (props?.maxHeight) dimensionStyle.maxHeight = props.maxHeight;
  if (props?.maxHeight) dimensionStyle.height = props.maxHeight;

  // scroll down on new messages
  useEffect(() => {
    if (!messagesDivRef.current) return;
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
  }, [messages.length]);

  // when active conversation id is first set, start a new conversation
  useEffect(() => {
    if (activeConversationAgentId) {
      const startConversation = async () => {
        setMessageLoading(true);
        setConversationOverEndState(null);

        const npcLoc = props.gameState?.ecs.getComponent(props.conversationWithEntId!, CGridCollider).gridPos!;
        const locationInfo = locationService.lookup(npcLoc);
        const ss = props.gameState?.gc.getSpriteDescriptionsInRegion(props.gameState.ecs, npcLoc, 3) ?? "";

        let envDescription = "";
        if (locationInfo?.description) envDescription += `${locationInfo.description}\n`;
        // if (ss) envDescription += ` Nearby is ${ss.join(' Also nearby is')}`;
        
        console.log(envDescription);

        const conversation = await conversationService.startConversation(
          activeConversationAgentId,
          envDescription,
          props.gameState!.gc);

        // update npc history
        conversation.history.push({
          playerStepsTaken: props.gameState?.gc.playerStepsTaken,
          msg: " you had a conversation with Brendan.",
        });

        const newMessages = mapConversationToMessages(conversation);
        setMessages(newMessages);
        setMessageLoading(false);
      };
      startConversation();
    }
  }, [activeConversationAgentId]);

  if (!conversationService) {
    return <div className="conversation" style={dimensionStyle}>
        <LoadingIndicator />
    </div>
  }

  if (!activeAgent) {
    return <div className="conversation" style={dimensionStyle} />
  }

  const handleNewMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  const handleEndConversation = async () => {
    setMessageLoading(true);
    const conversation = await conversationService.endConversation(
      activeConversationAgentId!, 
      conversationOverEndState ?? "Brendan Leaves");
    const newMessages = mapConversationToMessages(conversation);
    setMessages(newMessages);
    
    props.gameState!.gc.conversationWithEntId = null;
    props.gameState!.gc.triggerReactComponentRender();
    setMessageLoading(false);
  };

  const handleNpcAction = async (action: ResponseActionType) => {
    if (action === 'farewell') {
      setConversationOverEndState("Brendan leaves");
    } else if (action === 'move') {
      var location = await conversationService.getLocation(activeConversationAgentId!, Object.keys(locationData));
      console.log(`Move to ${location}`);
      if (location) {
        activeAgent.targetGridPos = locationData[location].outside;
        setConversationOverEndState(`You start heading to the ${location}`);
      }
    }
  }

  const handleSendMessage = async () => {
    if (messageLoading) return;
    if (newMessage.trim() === '') {
      return;
    }
    
    const newId = 'tmpId';
    const newMessages = [...messages, { id: newId, text: newMessage.trim(), sender: 'me' }] as MessageViewModel[];
    setMessages(newMessages.filter(x => x.text.trim()));
    setNewMessage('');
    
    try {
      setMessageLoading(true);
      const conversation = await conversationService.sendReply(activeConversationAgentId!, newMessage);
      const newMessages2 = mapConversationToMessages(conversation);
      setMessages(newMessages2.filter(x => x.text.trim()));

      const npcAction = conversation.messages[conversation.messages.length - 1].action;
      if (npcAction) {
        await handleNpcAction(npcAction);
      }
    } catch (e) {
      // todo display error
      console.log("Failed to send");
      console.error(e);
      setMessages(messages.filter(x => x.text.trim()));
    }
    setMessageLoading(false);
  };



  const handleEnterPressed = (event: any) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="conversation" style={dimensionStyle}>
      <div className="conversation__messages" ref={messagesDivRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`conversation__bubble conversation__bubble--${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="conversation__input">
        <textarea
          placeholder="Type a message... press enter to send"
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyDown={handleEnterPressed}
          disabled={!!conversationOverEndState}
        />
        {messageLoading 
          ? 
            <LoadingSpinner />
          : <div className="conversation__buttons">
            {!conversationOverEndState ? <button onClick={handleSendMessage}>Send</button> : undefined}
            <button onClick={handleEndConversation}>Leave</button>
          </div>
        }
       
      </div>
    </div>
  );
};

export default Conversation;