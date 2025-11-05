import {useChat} from '../../hooks/useChat';
import styles from './ChatOutput.module.css';

export default function ChatOutput() {
  const {messages} = useChat();

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
