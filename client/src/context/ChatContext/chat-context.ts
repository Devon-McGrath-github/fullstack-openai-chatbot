import {createContext} from 'react';

export type ChatMessage = {
  id: string; 
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
};

export type ChatContextType = {
  messages: ChatMessage[];
  replaceMessages: (msgs: ChatMessage[]) => void;
  addAssistant: (content: string) => void;
  addUser: (content: string) => void;
};


export const ChatContext = createContext<ChatContextType | undefined>(undefined);
