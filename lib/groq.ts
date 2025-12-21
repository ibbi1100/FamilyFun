import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

export const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export const getGroqCompletion = async (prompt: string, maxTokens: number = 100) => {
    if (!apiKey || apiKey === "undefined") {
        console.warn("Groq API Key is missing. Returning empty.");
        throw new Error("Groq API Key is missing or invalid");
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile", // Updated to latest supported model
            temperature: 0.7,
            max_tokens: maxTokens,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};
