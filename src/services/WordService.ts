import { WordInfo } from "@/types";
import { hashStringToInt } from "@/utils";

class WordService {
  /**
   * Based on the current day of the year, returns a pseudorandom word from our word bank.
   *
   * @returns The "word of the day" -- which is a pseudorandomly selected word.
   */

  async getWordOfTheDay(date: Date): Promise<string> {
    const res = await fetch("/api/words/all");
    if (!res.ok) throw new Error("Failed to get the word of the day");
    const data = await res.json();
    const index =
      hashStringToInt(date.toISOString().split("T")[0]) % data.words.length;
    const word = data.words[index];
    return word;
  }
  async getWordInfo(word: string): Promise<WordInfo> {
    const res = await fetch(
      `https://freedictionaryapi.com/api/v1/entries/en/${word}`
    );
    if (!res.ok) throw new Error("Failed to get word info");
    const data = await res.json();
    return data as WordInfo;
  }
  async validateWord(word: string): Promise<boolean> {
    const res = await fetch(
      `https://freedictionaryapi.com/api/v1/entries/en/${word.toLowerCase()}`
    );
    if (!res.ok) {
      return false;
    }
    const data = await res.json();
    return data.entries.length > 0;
  }
}

export const wordService = new WordService();
