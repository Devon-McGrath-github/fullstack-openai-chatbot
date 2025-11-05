import {useState, useCallback, useMemo, type ReactNode} from 'react';
import {ChatContext, type ChatMessage} from './chat-context';

export function ChatProvider({children}: {children: ReactNode}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const replaceMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
  }, []);

  const addAssistant = useCallback((content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const addUser = useCallback((content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const value = useMemo(
    () => ({ messages, replaceMessages, addAssistant, addUser }),
    [messages, replaceMessages, addAssistant, addUser]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
