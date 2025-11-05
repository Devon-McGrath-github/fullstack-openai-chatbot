import {useEffect, useRef, useState} from 'react';
import ChatInput from './components/ChatInput/ChatInput';
import ChatOutput from './components/ChatOutput/ChatOutput';
import {useChat} from './hooks/useChat';
import {ChatProvider} from './context/ChatContext';
import type {ChatMessage} from './context/ChatContext/chat-context';
import './App.css';

// Shape of the server response from /generate endpoint
type GenerateResponse = {
  conversationId: string;
  reply: string;
};

const STORAGE_KEY = 'conversationId';

const AppContent = () => {
  // State for loading spinner when waiting for AI response
  const [loading, setLoading] = useState<boolean>(false);

  // chat context gives us ways to replace all messages and append new ones
  const {replaceMessages, addAssistant, addUser} = useChat();

  // Avoid double-running Strict Mode
  const didLoad = useRef(false);

  // On first mount, if there's a saved conversationId, load its messages from the server
  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) return; // nothing to load if user hasn't chatted yet

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/conversations/${id}/messages`
        );
        if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
        const data: {messages: ChatMessage[]} = await res.json();

        // hydrate UI with messages persisted on the backend
        replaceMessages(data.messages);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Called when the user submits the prompt from the input
  const onSubmit = async (userPrompt: string) => {
    const prompt = userPrompt.trim();
    if (!prompt) return; // ignore empty submits

    // show the user's message immediately
    addUser(prompt);

    setLoading(true);
    try {
      // ask server/OpenAI for the assistant reply
      const {reply} = await generateQuery(prompt);

      // append assistant's response (server also persisted it)
      addAssistant(reply);
    } catch (err) {
      console.error(err);
      addAssistant('Error generating reply');
    } finally {
      setLoading(false);
    }
  };

  // Calls the backend /generate endpoint.
  // Sends the existing conversationId if we have one; otherwise the server will create it.
  const generateQuery = async (
    userPrompt: string
  ): Promise<{reply: string}> => {
    const conversationId = localStorage.getItem(STORAGE_KEY) ?? undefined;

    const res = await fetch('http://localhost:3002/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({queryDescription: userPrompt, conversationId}),
    });

    if (!res.ok) {
      // basic HTTP error handling
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data: GenerateResponse = await res.json();

    // Save/refresh the conversation id so future loads can rehydrate from the server
    if (data.conversationId) {
      localStorage.setItem(STORAGE_KEY, data.conversationId);
    }

    return {reply: (data.reply ?? '').trim()};
  };

  return (
    <main>
      {/* Header*/}
      <h2 style={{padding: '1rem 0'}}>OpenAI Query Interface</h2>

      {/* Chat */}
      <div className="appInner">
        <ChatOutput />
        <ChatInput onSubmit={onSubmit} loading={loading} />
      </div>
    </main>
  );
};

// Top-level provider wraps the app so children can access chat context
export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}
