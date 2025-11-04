import {useState, type ChangeEvent, type FormEvent} from 'react';
import styles from './styles.module.css';

type GenerateResponse = {
  gptQuery: string;
};

export default function App() {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [gptQuery, setGptQuery] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = await generateQuery();
    setGptQuery(query);
  };

  const generateQuery = async (): Promise<string> => {
    const response = await fetch('http://localhost:3002/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({queryDescription: userPrompt}),
    });

    const data: GenerateResponse = await response.json();
    return data.gptQuery.trim();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPrompt(e.target.value);
  };

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
      <pre>{gptQuery}</pre>
    </main>
  );
}
