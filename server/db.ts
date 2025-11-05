import Database from 'better-sqlite3';
import {randomUUID} from 'crypto';

export type Role = 'system' | 'user' | 'assistant';
export type MessageRow = {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: number;
};

// Create or open the local SQLite database
const db = new Database('chat.db');
db.pragma('foreign_keys = ON'); // enforce FKs
db.pragma('journal_mode = WAL'); // good perf/reliability

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('system','user','assistant')),
    content TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY(conversationId) REFERENCES conversations(id) ON DELETE CASCADE
  );
`);

// Statements
const upsertConversation = db.prepare(`
  INSERT OR IGNORE INTO conversations (id, title, createdAt, updatedAt)
  VALUES (?, NULL, ?, ?)
`);

const touchConversation = db.prepare(`
  UPDATE conversations SET updatedAt = ? WHERE id = ?
`);

const insertMessage = db.prepare(`
  INSERT INTO messages (id, conversationId, role, content, createdAt)
  VALUES (?, ?, ?, ?, ?)
`);

const listMessages = db.prepare(`
  SELECT id, conversationId, role, content, createdAt
  FROM messages WHERE conversationId = ? ORDER BY createdAt ASC
`);

// Create conversation if missing
export function ensureConversation(conversationId?: string): string {
  const now = Date.now();
  // If it exists, IGNORE. If not, create it.
  const id = conversationId ?? randomUUID();
  upsertConversation.run(id, now, now);
  return id;
}

export function addMessage(
  conversationId: string,
  role: Role,
  content: string
): MessageRow {
  const id = randomUUID();
  const createdAt = Date.now();

  // Insert message and bump conversation timestamp in a small transaction
  const tx = db.transaction(() => {
    insertMessage.run(id, conversationId, role, content, createdAt);
    touchConversation.run(createdAt, conversationId);
  });
  tx();

  return {id, conversationId, role, content, createdAt};
}

export function getMessages(conversationId: string): MessageRow[] {
  return listMessages.all(conversationId) as MessageRow[];
}
