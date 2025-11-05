import {useState, type ReactNode} from 'react';
import {ChatContext, type ChatMessage} from './chat-context';

export function ChatProvider({children}: {children: ReactNode}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: string) => {
    setMessages((prev) => [...prev, {id: prev.length + 1, content: message}]);
  };

  return (
    <ChatContext.Provider value={{messages, addMessage}}>
      {children}
    </ChatContext.Provider>
  );
}
