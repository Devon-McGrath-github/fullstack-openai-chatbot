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
  // Example of using a different model (commented out)
  // const gptNano = async (
  //   queryDescription: string
  // ): Promise<string | undefined> => {
  //   const response = await openaiClient.createCompletion({
  //     model: 'gpt-5-nano',
  //     prompt: `Answer questions as quickly as possible with natural language. \n\n${queryDescription}.`,
  //     max_tokens: 100,
  //     temperature: 0,
  //   });
  //   return response.data.choices[0]?.text?.trim();
  // };

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
      {role: 'assistant', content: 'SELECT * FROM users;'},
      {
        role: 'user',
        content: `Answer the following question:\n\n${queryDescription}`,
      },
    ];

    const response = await openaiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    return response.data.choices[0]?.message?.content?.trim();
  };

  const sqlQuery = await chatGPT(queryDescription);
  return sqlQuery ?? '';
}
