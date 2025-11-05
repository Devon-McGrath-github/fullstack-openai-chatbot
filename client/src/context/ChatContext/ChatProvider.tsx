import {useState, useCallback, useMemo, type ReactNode} from 'react';
import {ChatContext, type ChatMessage} from './chat-context';

// Provides chat data and functions to the rest of the app
export function ChatProvider({children}: {children: ReactNode}) {
  // Keep track of all chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Replace the whole list of messages (used when loading from the server)
  const replaceMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
  }, []);

  // Add a new assistant message
  const addAssistant = useCallback((content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  // Add a new user message
  const addUser = useCallback((content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  // Bundle everything up and pass it down through context
  const value = useMemo(
    () => ({messages, replaceMessages, addAssistant, addUser}),
    [messages, replaceMessages, addAssistant, addUser]
  );

  // Make the chat state and helpers available to all children
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
