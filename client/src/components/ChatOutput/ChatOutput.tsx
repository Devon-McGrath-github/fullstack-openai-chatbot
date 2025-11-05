import {useChat} from '../../hooks/useChat';
import styles from './ChatOutput.module.css';

// Displays all the chat messages
export default function ChatOutput() {
  const {messages} = useChat(); // get all messages from context

  return (
    <div className={styles.outputContainer}>
      {messages.map((m) => (
        <div
          key={m.id}
          className={`${styles.message} ${m.role === 'assistant' ? styles.assistant : styles.user}`}
          aria-live="polite"
        >
          <p>{m.content}</p>
        </div>
      ))}
    </div>
  );
}
