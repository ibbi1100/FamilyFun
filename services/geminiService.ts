import { GoogleGenAI, Type } from "@google/genai";
import { Activity } from "../types";

// Moved instance creation inside the function to ensure the most current API key is used
export const generateCrazyChallenge = async (): Promise<Activity> => {
  // Always use the named parameter for apiKey and obtain it from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const owners = ['Dad', 'Son', 'Shared'];
  const owner = owners[Math.floor(Math.random() * owners.length)];
  const emojis = ['🤪', 'REX', '🚀', '🎨', '🧩', '🎸', '🏃‍♂️', '🌮', '🎭'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest a "Chaos Control" challenge for a ${owner} mission. It should be silly, quick (under 10 mins), and gamified. 
    Format: Dad mission, Son mission, or a Shared "Face Off".`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          duration: { type: Type.STRING },
          xp: { type: Type.NUMBER },
        },
        required: ['title', 'description', 'duration', 'xp'],
      }
    }
  });

  // response.text is a getter property, not a method
  const data = JSON.parse(response.text || '{}');
  
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    owner: owner as 'Dad' | 'Son' | 'Shared',
    emoji: emoji
  };
};