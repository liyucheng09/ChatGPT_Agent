import axios from 'axios';
import useSWR from 'swr'
import { CHATGPT_API_KEY } from './.apikeys'

const apiKey = CHATGPT_API_KEY;
const DAVINCI_API_PATH = "https://api.openai.com/v1/engines/text-davinci-002/completions";
const CHATGPT_API_PATH = "https://api.openai.com/v1/chat/completions";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};

export interface GptMessage {
  content: string;
  role: 'assistant' | 'user' | 'system';
}


export const postChatGpt = async (messages: GptMessage[]) : Promise<string> => {
  const payload = {
    model: "gpt-3.5-turbo",
    messages
  };

  try {
    console.log(`SEND "${prompt}"`);
    const response = await axios.post(CHATGPT_API_PATH, payload, { headers });
    console.log(response);
    const textResponse = response.data.choices[0].message.content as string;
    return textResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const postChat = async (prompt: string) => {
  if (!prompt) return '';
  const data = {
    prompt,
    max_tokens: 30,
    n: 1,
    temperature: 0.7,
  };

  try {
    console.log(`SEND "${prompt}"`);

    const response = await axios.post(DAVINCI_API_PATH, data, { headers });
    const textReponse = response.data.choices[0].text;
    return textReponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const useChat = (prompt: string) => {
  const cacheKey = [CHATGPT_API_PATH, prompt];
  const { data, error, isLoading } = useSWR(cacheKey, () => postChat(prompt))
  return {
    chatResponse: data,
    isLoading,
    isError: error
  }
}