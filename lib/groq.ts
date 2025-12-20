import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

export const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export const getGroqCompletion = async (prompt: string, maxTokens: number = 100) => {
    if (!apiKey) {
        throw new Error("Groq API Key is missing");
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-70b-8192", // Fast and high quality
            temperature: 0.7,
            max_tokens: maxTokens,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};
