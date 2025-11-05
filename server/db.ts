import Database from 'better-sqlite3';
import {randomUUID} from 'crypto';

// Basic types for messages and roles
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
db.pragma('journal_mode = WAL'); // helps with performance and reliability

// Set up the database tables if they don’t exist yet
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

// Pre-build SQL statements for speed and cleaner code
const insertConversation = db.prepare(`
  INSERT INTO conversations (id, title, createdAt, updatedAt) VALUES (?, ?, ?, ?)
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

// Create a new conversation if one doesn't already exist
export function ensureConversation(conversationId?: string): string {
  if (conversationId) return conversationId;
  const id = randomUUID();
  const now = Date.now();
  insertConversation.run(id, null, now, now);
  return id;
}

// Add a new message and update the conversation’s timestamp
export function addMessage(
  conversationId: string,
  role: Role,
  content: string
): MessageRow {
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  insertMessage.run(id, conversationId, role, content, createdAt);
  touchConversation.run(createdAt, conversationId);
  return {id, conversationId, role, content, createdAt};
}

// Get all messages for a given conversation
export function getMessages(conversationId: string): MessageRow[] {
  return listMessages.all(conversationId) as MessageRow[];
}
