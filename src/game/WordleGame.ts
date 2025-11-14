import { LetterStatus } from "@/types";
import { GameState } from "@/types/game";

export class WordleGame {
  guesses: Word[] = [];
  solution: Word | null = null;
  state: GameState;
  wins: number = 0;

  constructor() {
    this.state = GameState.IDLE;
  }
  addGuess(guess: string) {
    if (!this.solution) return;
    this.guesses.push(new Word(guess, this));
    if (guess.toUpperCase() === this.solution.word) {
      this.wins++;
      this.state = GameState.WON;
    } else if (this.guesses.length >= 6) {
      this.state = GameState.LOST;
    }
  }

  start(solution: string) {
    this.guesses = [];
    this.solution = new Word(solution, this);
    this.state = GameState.PLAYING;
  }
}
export class Word {
  word: string;
  letters: Letter[] = [];
  context: WordleGame;
  constructor(word: string, context: WordleGame) {
    this.context = context;
    this.word = word.toUpperCase();
    for (let i = 0; i < word.length; i++) {
      this.letters.push(new Letter(word[i], this.getLetterStatus(word[i], i)));
    }
  }
  getLetterStatus = (letter: string, index: number): LetterStatus => {
    if (!this.context.solution) return "empty";
    const other = this.context.solution.letters[index].letter;
    if (other.toUpperCase() === letter.toUpperCase()) {
      return "correct";
    } else if (this.context.solution.word.includes(letter.toUpperCase())) {
      return "present";
    }
    return "absent";
  };
}

class Letter {
  letter: string;
  status: LetterStatus;
  constructor(letter: string, status: LetterStatus) {
    this.letter = letter;
    this.status = status;
  }
  setStatus(status: LetterStatus) {
    this.status = status;
  }
}
