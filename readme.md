# ChatGPT Query Assistant

A **full-stack web application** that lets users ask questions in plain English and get intelligent, conversational answers powered by OpenAI’s ChatGPT API.

Built with **React (Vite)** on the frontend and **Node.js + Express** on the backend, this app provides a chat interface for natural language queries and responses.

---

## Features

- **AI-powered query generation** — converts natural language prompts into SQL queries or responses.
- **Full-stack architecture** — React + Vite frontend, Express + Node backend.
- **OpenAI API integration** — communicates directly with GPT models for intelligent text generation.
- **Real-time responses** — user input is processed instantly through REST endpoints.
- **Modular structure** — clear separation between client and server for easy development and deployment.

---

## Tech Stack

| Layer                  | Technology                            |
| ---------------------- | ------------------------------------- |
| Frontend               | React, TypeScript, Vite, Tailwind CSS |
| Backend                | Node.js, Express, TypeScript          |
| AI Integration         | OpenAI API                            |
| Package Manager        | pnpm                                  |
| Environment Management | dotenv                                |

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/chat-assistant.git
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a .env file inside the /server folder:

```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3002
```

### 4. Start the development servers

From the project root:

```bash
pnpm run dev
```

This runs both:

- client on <http://localhost:5173>
- server on <http://localhost:3002>
