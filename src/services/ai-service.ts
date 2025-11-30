import { GuessFeedback } from "@/types";

export const AIService = {
  async getAIGuess(guesses: GuessFeedback[]) {
    const res = await fetch("/api/ai-turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guesses }),
    });

    if (!res.ok) throw new Error("Failed to get AI guess");

    const data = await res.json();
    return data.aiGuess as string;
  },
};
