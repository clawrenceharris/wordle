export class WordService {
  static async getWordOfTheDay(): Promise<string> {
    const res = await fetch("/api/wordle/wotd");
    if (!res.ok) throw new Error("Failed to fetch word of the day");
    const data = await res.json();
    return data.word.toUpperCase();
  }

  static async validateWord(word: string): Promise<boolean> {
    const res = await fetch(`https://your-wordle-api.com/validate/${word}`);
    const data = await res.json();
    return data.valid;
  }
}
