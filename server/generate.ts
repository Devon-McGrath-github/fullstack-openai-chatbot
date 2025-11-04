import openaiClient from './api.js'; // keep .js if your api file isn’t converted yet

// Define the shape of a chat message
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Define what our generate function returns
export default async function generate(
  queryDescription: string
): Promise<string> {
  const daVinci = async (
    queryDescription: string
  ): Promise<string | undefined> => {
    const response = await openaiClient.createCompletion({
      model: 'text-davinci-003',
      prompt: `Convert the following natural language description into a SQL query:\n\n${queryDescription}`,
      max_tokens: 100,
      temperature: 0,
    });
    return response.data.choices[0]?.text?.trim();
  };

  const chatGPT = async (
    queryDescription: string
  ): Promise<string | undefined> => {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a translator from plain English to SQL.',
      },
      {
        role: 'user',
        content:
          'Convert the following natural language description into a SQL query:\n\nShow all all the elements in the table users',
      },
      {role: 'assistant', content: 'SELECT * FROM users;'},
      {
        role: 'user',
        content: `Convert the following natural language description into a SQL query:\n\n${queryDescription}`,
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
