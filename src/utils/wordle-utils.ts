import { createHash } from "crypto";
import { KeyStatus } from "@/components";
import { GuessWithFeedback, LetterStatus } from "@/types";
import { WORD_BANK } from "@/utils";

export function getTileBackgroundColor(status?: LetterStatus | KeyStatus) {
  switch (status) {
    case "absent":
      return "bg-tile-absent";
    case "present":
      return "bg-tile-present";

    case "correct":
      return "bg-tile-correct";
    case "default":
      return "bg-key";
    default:
      return "bg-transparent";
  }
}

export function getTileBorderColor(status?: LetterStatus | KeyStatus) {
  switch (status) {
    case "absent":
      return "border-tile-absent";
    case "present":
      return "border-tile-present";

    case "correct":
      return "border-tile-correct";
    default:
      return "border-transparent";
  }
}

export function toGuessWithFeedback(
  guess: string,
  solution: string
): GuessWithFeedback {
  const feedback = getWordFeedback(guess, solution);

  const newGuess = [
    ...Array.from(guess).map((letter, i) => ({
      letter,
      status: feedback[i],
    })),
  ];
  return newGuess;
}

export function getWordFeedback(
  word: string,
  solution: string
): LetterStatus[] {
  const guess = Array.from(word.toUpperCase());
  const sol = Array.from(solution.toUpperCase());

  const result: LetterStatus[] = Array(guess.length).fill("absent");

  // Frequency map for solution letters for handling duplicates
  const freq: Record<string, number> = {};

  for (const char of sol) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Pass 1: Mark greens
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === sol[i]) {
      result[i] = "correct";
      freq[guess[i]]--; // consume one instance of the letter
    }
  }

  // Pass 2: Mark yellows / grays
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue; // already handled

    const letter = guess[i];

    if (freq[letter] > 0) {
      result[i] = "present";
      freq[letter]--;
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

export function pickWordFromSeed(input: string | Date): string {
  // Accept a Date or any string (e.g. a 6-char match code). Normalize to a string seed.
  const seed =
    input instanceof Date ? input.toISOString() : String(input).trim();

  const hash = createHash("sha256").update(seed).digest("hex");
  // use a slice of the hex and BigInt mod length to get an index
  const prefix = BigInt("0x" + hash.slice(0, 16));
  const index = Number(prefix % BigInt(WORD_BANK.length));

  return WORD_BANK[index].toUpperCase();
}

export function pickRandomWord(): string {
  const index = Math.floor(Math.random() * WORD_BANK.length);

  return WORD_BANK[index].toUpperCase();
}
