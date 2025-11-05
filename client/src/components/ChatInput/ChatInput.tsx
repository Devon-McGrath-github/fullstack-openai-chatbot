import {useState, type ChangeEvent, type FormEvent} from 'react';

import styles from './ChatInput.module.css';
import Spinner from '../Spinner/Spinner';

type ChatInputProps = {
  onSubmit: (userPrompt: string) => Promise<void>;
  loading: boolean;
};

const ChatInput = ({onSubmit, loading}: ChatInputProps) => {
  // Store whatever the user is typing
  const [userPrompt, setUserPrompt] = useState<string>('');

  // Update input state as the user types
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPrompt(e.target.value);
  };

  // When the user hits Enter or clicks submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(userPrompt);
    setUserPrompt(''); // clear the input
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
