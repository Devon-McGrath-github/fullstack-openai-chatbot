import {useChat} from '../../hooks/useChat';
import styles from './ChatOutput.module.css';

export default function ChatOutput() {
  const {messages} = useChat();

  return (
    <div className={styles.outputContainer}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            // message.id % 2 === 0 ? styles.assistant : styles.user
            styles.assistant
          }`}
          aria-live="polite"
        >
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}
