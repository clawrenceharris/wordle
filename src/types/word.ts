export type LetterStatus = "correct" | "present" | "absent" | "empty";

export type WordInfo = {
  senses: [{ definition: string }];
  examples: string[];
};

export type GuessWithFeedback = {
  letter: string;
  status: LetterStatus;
}[];
