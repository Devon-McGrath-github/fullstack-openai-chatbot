import {createContext} from 'react';

// Defines what a single chat message looks like
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
};

// Lists what data and functions the chat context will provide
export type ChatContextType = {
  messages: ChatMessage[];
  replaceMessages: (msgs: ChatMessage[]) => void;
  addAssistant: (content: string) => void;
  addUser: (content: string) => void;
};

// Creates the actual chat context so other parts of the app can use it
export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
