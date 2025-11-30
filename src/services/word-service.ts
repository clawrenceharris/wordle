import { WordInfo } from "@/types";

export const wordService = {
  async getWordInfo(word: string): Promise<WordInfo> {
    const res = await fetch(
      `https://freedictionaryapi.com/api/v1/entries/en/${word}`
    );
    if (!res.ok) throw new Error("Failed to get word info");
    const data = await res.json();
    return data as WordInfo;
  },
  async validateWord(word: string): Promise<boolean> {
    const response = await fetch("/api/words/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word }),
    });
    const result = await response.json();
    return result.isValid;
  },
};
