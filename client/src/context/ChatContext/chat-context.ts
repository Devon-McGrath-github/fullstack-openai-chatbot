import {createContext} from 'react';

export type ChatMessage = {id: number; content: string};
export type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (message: string) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
