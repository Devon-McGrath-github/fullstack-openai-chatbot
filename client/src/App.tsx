import {useState} from 'react';
import ChatInput from './components/ChatInput/ChatInput';
import ChatOutput from './components/ChatOutput/ChatOutput';
import {useChat} from './hooks/useChat';
import {ChatProvider} from './context/ChatContext';
import './App.css';

type GenerateResponse = {
  query: string;
};

const AppContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {addMessage} = useChat();

  const onSubmit = async (userPrompt: string) => {
    setLoading(true);
    try {
      const query = await generateQuery(userPrompt);
      addMessage(query);
    } catch (err) {
      console.error(err);
      addMessage('Error generating query');
    } finally {
      setLoading(false);
    }
  };

  const generateQuery = async (userPrompt: string): Promise<string> => {
    const res = await fetch('http://localhost:3002/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({queryDescription: userPrompt}),
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data: GenerateResponse = await res.json();
    return (data.query ?? '').trim();
  };

  return (
    <main>
      <h2>ChatGPT</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <ChatOutput />
        <ChatInput onSubmit={onSubmit} loading={loading} />
      </div>
    </main>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}
