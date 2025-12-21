import { getGroqCompletion } from "../lib/groq";
import { Activity, GameContentType } from "../types";
import { supabase } from "../lib/supabase";

// Helper: Fetch unplayed content from DB
const fetchFromDB = async (type: GameContentType): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('game_content')
      .select('*')
      .eq('type', type)
      .eq('is_used', false)
      .limit(1)
      // Randomize is hard in Supabase basic select without RPC, 
      // but we can just picking the first unused one is "random enough" relative to creation
      // or we can use a small trick if dataset is small. 
      // For now, let's just grab one. Ideally we'd use .order('random()') but that needs RPC.
      // We will rely on the fact that we'll mark them used.
      .maybeSingle();

    if (error || !data) return null;

    // Mark as used immediately to avoid duplicates (optimistic)
    // In a real app, do this when the user "accepts" the turn.
    await supabase
      .from('game_content')
      .update({ is_used: true })
      .eq('id', data.id);

    return data.content;
  } catch (err) {
    console.error("DB Fetch Error:", err);
    return null;
  }
};

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
  // 1. Try DB
  const dbContent = await fetchFromDB('charade');
  // Since dbContent stores { "movie": "...", "emoji": "..." } and we need title/emojis
  if (dbContent) {
    return { title: dbContent.movie, emojis: dbContent.emoji };
  }

  // 2. Fallback AI
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
  // 1. Try DB
  const dbContent = await fetchFromDB('joke'); // Stores { "setup": "...", "punchline": "..." }
  if (dbContent) {
    return `${dbContent.setup} ... ${dbContent.punchline}`;
  }

  // 2. Fallback AI
  const prompt = `Tell a cringe-worthy "Dad Joke". Short punchline.
  Return ONLY the joke. NO quotes/markdown.`;

  try {
    return (await getGroqCompletion(prompt, 100)).trim();
  } catch (error) {
    return "Why don't skeletons fight each other? They don't have the guts.";
  }
};

export const generateFutureSelfDescription = async (): Promise<{ title: string; description: string }> => {
  // 1. Try DB
  const dbContent = await fetchFromDB('future'); // Stores { "prediction": "..." } or { "title": "...", "description": "..." }
  if (dbContent) {
    // If DB has old format or new format, handle gracefully
    if (dbContent.description) return dbContent;
    if (dbContent.prediction) return { title: "Future You", description: dbContent.prediction };
  }

  // 2. Fallback AI
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
  // 1. Try DB
  // For Truth/Dare, we might want to filter by "role" if we stored it, but our seed data has "role".
  // Let's try to fetch one.
  const dbContent = await fetchFromDB('dare'); // We'll just use 'dare' type for now as 'truth' isn't seeded separately yet
  // Or seeded as 'dare' with { "role": "...", "text": "..." }
  if (dbContent) {
    return { type: 'Dare', content: dbContent.text };
  }

  // 2. Fallback AI
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

// --- ADMIN REFILL ---
export const refillGameContent = async (count: number = 5): Promise<string> => {
  // This runs on client, calling AI multiple times.
  // In production, this should be an Edge Function.
  // For now, we loop.
  let added = 0;

  try {
    // 1. Jokes
    const jokesPrompt = `Generate ${count} funny dad jokes in JSON format based on a random topic.
    Format: [ {"setup": "...", "punchline": "..."} ]`;
    const jokesText = await getGroqCompletion(jokesPrompt, 1000);
    const jokes = JSON.parse(jokesText.replace(/```json/g, '').replace(/```/g, '').trim());
    if (Array.isArray(jokes)) {
      await supabase.from('game_content').insert(jokes.map(j => ({ type: 'joke', content: j })));
      added += jokes.length;
    }

    return `Refilled! Added ${added} new items to the database.`;
  } catch (err: any) {
    console.error("Refill Failed:", err);
    return "Refill failed. AI might be tired.";
  }
};
