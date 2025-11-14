import seedrandom from "seedrandom";
import { five_char_words } from "./word-list";

// Lightweight deterministic string -> number hash (djb2-like) to produce a stable index.
// Avoids using Node's crypto.hash API which expects multiple arguments and returns non-number types.
const hashStringToInt = (s: string): number => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  // Ensure a non-negative 32-bit integer
  return h >>> 0;
};

/**
 * Determines the number of days a specific `Date` has been since 01/01/2000.
 * @param date The `Date` in question
 * @returns The number of days `date` has been since 01/01/2000.
 */
const getDayDiff = (date: Date): number => {
  return Math.floor(
    (date.valueOf() - new Date(2000, 0, 0).valueOf()) / (1000 * 60 * 60 * 24)
  );
};

/**
 * Checks to see if a character is present within a word.
 *
 * @param guess The character in question
 * @param ans The word we are looking to find the character in
 * @returns Whether or not guess is present in ans.
/**
 * Based on the current day of the year, returns a pseudorandom word from our word bank.
 *
 * @returns The "word of the day" -- which is a pseudorandomly selected word.
 */
const getWordOfTheDay = (): string => {
  const today = new Date().toISOString().split("T")[0]; // “2025-11-12”
  const index = hashStringToInt(today) % five_char_words.length;
  const solution = five_char_words[index];
  return solution;
};

export { getWordOfTheDay, getDayDiff as getDayOfYear };
