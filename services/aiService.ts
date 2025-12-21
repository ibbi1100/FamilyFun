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
    console.error("AI Generation Error (CAUGHT):", error);
    // Explicit Fallback
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: "Dance Off (Fallback)",
      description: "Do your best robot dance for 30 seconds. (AI unavailable)",
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

export const generateScavengerHunt = async (location: string): Promise<string[]> => {
  const prompt = `Create a list of 5 simple, findable items for a family scavenger hunt. Location: ${location}.
  Items should be safe and common.
  Return ONLY a valid JSON array of strings. Example: ["Red sock", "Wooden spoon"]. NO markdown.`;

  try {
    const text = await getGroqCompletion(prompt, 200);
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanText);
    return Array.isArray(data) ? data : ["Something fuzzy", "Something blue", "A spoon", "A toy", "A book"];
  } catch (error) {
    console.error("AI Scavenger Error:", error);
    return ["Something fuzzy", "Something blue", "A spoon", "A toy", "A book"];
  }
};

export const generateMysteryActivity = async (duration: string, energy: string): Promise<{ title: string; description: string }> => {
  const prompt = `Suggest ONE fun, spontaneous family activity/minigame.
  Constraints: Duration ~${duration}, Energy Level: ${energy}.
  Return ONLY valid JSON. Structure: { "title": "string", "description": "string" }. NO markdown.`;

  try {
    const text = await getGroqCompletion(prompt, 200);
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI Mystery Error:", error);
    return { title: "Pillow Fort Wars", description: "Build the ultimate fortress and defend it!" };
  }
};

export const generateJudgeCommentary = async (taskTitle: string, isApproved: boolean): Promise<string> => {
  const prompt = `You are the "Silly Family Judge". A user just sent proof for the task: "${taskTitle}".
  Verdict: ${isApproved ? "APPROVED" : "REJECTED"}.
  Write a SHORT, funny 1-sentence commentary on the verdict. 
  If approved: Be grand but slightly suspicious or over-the-top.
  If rejected: Be clearly disappointed but funny.
  Return ONLY the sentence. NO quotes.`;

  try {
    const text = await getGroqCompletion(prompt, 150);
    return text.replace(/"/g, '').trim();
  } catch (error) {
    return isApproved ? "The Tribunal accepts your offering." : "This evidence is inadmissible!";
  }
};

// --- New Game Functions ---

export const generateEmojiCharades = async (): Promise<{ title: string; emojis: string }> => {
  const prompt = `Think of a popular family-friendly movie, book, or phrase. 
  Convert it into a sequence of 3-5 emojis.
  Return ONLY valid JSON: { "title": "The Lion King", "emojis": "🦁👑🌅" }. NO markdown.`;

  try {
    const text = await getGroqCompletion(prompt, 150);
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    return { title: "Finding Nemo", emojis: "🔍🐠🌊" };
  }
};

export const generateDadJoke = async (): Promise<string> => {
  const prompt = `Tell a cringe-worthy "Dad Joke". Short punchline.
  Return ONLY the joke. NO quotes/markdown.`;

  try {
    return (await getGroqCompletion(prompt, 100)).trim();
  } catch (error) {
    return "Why don't skeletons fight each other? They don't have the guts.";
  }
};

export const generateFutureSelfDescription = async (): Promise<{ title: string; description: string }> => {
  // Simulating analysis since we can't upload images yet
  const prompt = `Invent a funny "Future Self" prediction for a family member in 20 years.
  Include a "Title/Job" and a 1-sentence description.
  Return ONLY valid JSON: { "title": "Mars Potato Farmer", "description": "You exclusively grow potatoes on the red planet and refuse to eat anything else." }. NO markdown.`;

  try {
    const text = await getGroqCompletion(prompt, 200);
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    return { title: "Professional Nap Taker", description: "You have won 3 Olympic Gold Medals in sleeping." };
  }
};

export const generateTruthOrDare = async (role: string): Promise<{ type: 'Truth' | 'Dare'; content: string }> => {
  const prompt = `Generate a family-friendly Truth or Dare challenge for a person with the role: "${role}".
  If Truth: Make it a funny/embarrassing (safe) question.
  If Dare: Make it physical or silly.
  Return ONLY valid JSON: { "type": "Truth" or "Dare", "content": "string" }. NO markdown.`;

  try {
    const text = await getGroqCompletion(prompt, 150);
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    return { type: "Dare", content: "Walk like a crab for 1 minute." };
  }
};
