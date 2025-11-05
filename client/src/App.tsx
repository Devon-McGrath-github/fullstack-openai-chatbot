import {useState, type ChangeEvent, type FormEvent, useEffect} from 'react';
import styles from './styles.module.css';

type GenerateResponse = {
  query: string;
};

export default function App() {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [gptQuery, setGptQuery] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = await generateQuery();
    setGptQuery(query);
    console.log('Generated query (from submit):', query);
  };

  const generateQuery = async (): Promise<string> => {
    const res = await fetch('http://localhost:3002/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({queryDescription: userPrompt}),
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data: GenerateResponse = await res.json();
    console.log('Response from server:', data);
    return (data.query ?? '').trim();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPrompt(e.target.value);
  };

  // If you want to see state updates reliably:
  useEffect(() => {
    if (gptQuery) console.log('GPT Query state changed:', gptQuery);
  }, [gptQuery]);

  return (
    <main className={styles.main}>
      <h3>GPT</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="query-description"
          placeholder="Describe your query"
          value={userPrompt}
          onChange={handleChange}
        />
        <input type="submit" value="Generate query" />
      </form>
      <p>{gptQuery}</p>
    </main>
  );
}
