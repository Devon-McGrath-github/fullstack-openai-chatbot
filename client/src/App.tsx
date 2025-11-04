import {useState} from 'react';
import styles from './styles.module.css';

export default function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [gptQuery, setgptQuery] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const query = await generateQuery();
    setgptQuery(query);
  };

  const generateQuery = async () => {
    const response = await fetch('http://localhost:3002/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({queryDescription: userPrompt}),
    });

    const data = await response.json();
    return data.gptQuery.trim();
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
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <input type="submit" value="Generate query" />
      </form>
      <pre>{gptQuery}</pre>
    </main>
  );
}
