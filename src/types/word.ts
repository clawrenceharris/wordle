export type Letter = {
  letter: string;
  status: LetterStatus;
};

export type LetterStatus = "correct" | "present" | "absent" | "empty";
export type WordResponse = {
  _id: string;
  word: string;
  category: string;
  numLetters: number;
  numSyllables: number;
  __v: number;
  hint: string;
};
export type WordsResponse = {
  words: WordResponse[];
};
