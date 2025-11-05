// generate.ts
import openai from './api';

type Role = 'system' | 'user' | 'assistant';
type ChatMessage = {role: Role; content: string};

export type GenerateOptions = {
  model?: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
};

/* Generate a natural-language answer from OpenAI. */
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

  const messages: ChatMessage[] = [
    {role: 'system', content: system},
    {role: 'user', content: queryDescription.trim()},
  ];

  try {
    const res = await openai.createChatCompletion({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return res.data.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (err) {
    console.error('OpenAI error:', err);
    return '';
  }
}
