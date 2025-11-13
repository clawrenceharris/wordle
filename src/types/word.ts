export type Letter = {
  letter: string;
  status: LetterStatus;
};

export type LetterStatus = "correct" | "present" | "absent" | "empty";

export type WordInfo = {
  senses: [{ definition: string }];
  examples: string[];
};
