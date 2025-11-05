import {useState, type ChangeEvent, type FormEvent} from 'react';

import styles from './ChatInput.module.css';
import Spinner from '../Spinner/Spinner';

type ChatInputProps = {
  onSubmit: (userPrompt: string) => Promise<void>;
  loading: boolean;
};

const ChatInput = ({onSubmit, loading}: ChatInputProps) => {
  const [userPrompt, setUserPrompt] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPrompt(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(userPrompt);
    setUserPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="query-description"
        placeholder="Describe your query"
        value={userPrompt}
        onChange={handleChange}
        disabled={loading}
        className={styles.input}
      />
      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? <Spinner /> : 'Ask Anything'}
      </button>
    </form>
  );
};

export default ChatInput;
