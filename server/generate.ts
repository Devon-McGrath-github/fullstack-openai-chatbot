import openai from './api';

// Define the different types of chat roles
type Role = 'system' | 'user' | 'assistant';
type ChatMessage = {role: Role; content: string};

// Optional settings you can pass when generating a response
export type GenerateOptions = {
  model?: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
};

// Ask OpenAI for a response based on the user's input
export default async function generate(
  queryDescription: string,
  {
    model = 'gpt-4o-mini',
    system = 'You are a concise, helpful assistant.',
    temperature = 0.2,
    maxTokens = 512,
  }: GenerateOptions = {}
): Promise<string> {
  if (!queryDescription?.trim()) return '';

  // Build the message list that OpenAI will use for context
  const messages: ChatMessage[] = [
    {role: 'system', content: system},
    {role: 'user', content: queryDescription.trim()},
  ];

  try {
    // Send the messages to OpenAI and wait for a reply
    const res = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    // Return the assistant's reply text, or an empty string if none
    return res.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (err) {
    // Log any errors but don’t crash the app
    console.error('OpenAI error:', err);
    return '';
  }
}
