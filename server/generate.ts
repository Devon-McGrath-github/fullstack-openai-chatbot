import openaiClient from './api.ts';

// Define the shape of a chat message
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Define what our generate function returns
export default async function generate(
  queryDescription: string
): Promise<string> {
  const chatGPT = async (
    queryDescription: string
  ): Promise<string | undefined> => {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an assistant that helpfully answers questions.',
      },
      {
        role: 'user',
        content: 'Answer the following question:',
      },
      {
        role: 'assistant',
        content:
          'Sure! Please provide the question you would like me to answer.',
      },
      {
        role: 'user',
        content: `Answer the following question:\n\n${queryDescription}`,
      },
    ];

    const response = await openaiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    return response.data.choices[0]?.message?.content?.trim();
  };

  const gptQuery = await chatGPT(queryDescription);
  return gptQuery ?? '';
}
