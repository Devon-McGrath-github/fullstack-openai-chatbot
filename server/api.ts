import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Grab the API key from the environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;

// If there’s no API key, stop the app and show an error
if (!openaiApiKey) {
  console.error('OPENAI_API_KEY is not set.');
  process.exit(1);
}

// Create the OpenAI client using the API key and export it
const openai = new OpenAI({
  apiKey: openaiApiKey,
});
export default openai;
