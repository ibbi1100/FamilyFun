import { getGroqCompletion } from "../lib/groq";
import { Activity } from "../types";

export const generateCrazyChallenge = async (): Promise<Activity> => {
    const owners = ['Dad', 'Son', 'Shared'];
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const emojis = ['🤪', 'REX', '🚀', '🎨', '🧩', '🎸', '🏃‍♂️', '🌮', '🎭'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const prompt = `Suggest a "Chaos Control" challenge for a ${owner} mission. It should be silly, quick (under 10 mins), and gamified. 
  Format: Dad mission, Son mission, or a Shared "Face Off".
  
  Return ONLY a valid JSON object with no markdown formatting or backticks. 
  Structure:
  {
    "title": "string",
    "description": "string",
    "duration": "string",
    "xp": number
  }`;

    try {
        const text = await getGroqCompletion(prompt, 300);
        // clean up any markdown code blocks if the model adds them despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);

        return {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            owner: owner as 'Dad' | 'Son' | 'Shared',
            emoji: emoji
        };
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fallback if AI fails
        return {
            id: Math.random().toString(36).substr(2, 9),
            title: "Dance Off!",
            description: "Do your best robot dance for 30 seconds.",
            duration: "30s",
            xp: 50,
            owner: owner as 'Dad' | 'Son' | 'Shared',
            emoji: emoji
        };
    }
};

export const enhanceChallenge = async (inputTitle: string): Promise<{ title: string; xp: number }> => {
    const prompt = `Enhance this simple activity title into a fun, gamified challenge title for a family app. Keep it short but exciting.
  Input: "${inputTitle}"
  
  Return ONLY a valid JSON object with no markdown formatting.
  Structure:
  {
    "title": "string",
    "xp": number (suggest a value between 20 and 100 based on difficulty)
  }`;

    try {
        const text = await getGroqCompletion(prompt, 150);
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);
        return data;
    } catch (error) {
        console.error("AI Enhance Error:", error);
        return { title: inputTitle + " (EXTREME EDITION)", xp: 50 };
    }
};
