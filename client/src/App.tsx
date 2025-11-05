import {useState, type ChangeEvent, type FormEvent} from 'react';
import styles from './styles.module.css';

type GenerateResponse = {
  query: string;
};

export default function App() {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [gptQuery, setGptQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = await generateQuery();
      setGptQuery(query);
    } catch (err) {
      console.error(err);
      setGptQuery('Error generating query');
    } finally {
      setLoading(false);
    }
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
    return (data.query ?? '').trim();
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
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            'Ask Anything'
          )}
        </button>
      </form>
      <pre aria-live="polite">{gptQuery}</pre>
    </main>
  );
}
