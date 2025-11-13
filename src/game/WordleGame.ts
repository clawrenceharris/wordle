import { LetterStatus } from "@/types";
import { GameState } from "@/types/game";

export class WordleGame {
  guesses: Word[];
  solution: Word | null = null;
  state: GameState;
  constructor(
    solution: Word | null = null,
    state: GameState = GameState.IDLE,
    guesses: Word[] = []
  ) {
    this.solution = solution;
    this.guesses = guesses;
    this.state = state;
  }
  makeGuess(guess: Word) {
    const newGuesses = [...this.guesses, guess];
    return new WordleGame(this.solution, this.state, newGuesses);
  }

  start(solution: string) {
    return new WordleGame(new Word(solution, this), GameState.PLAYING);
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
    if (other === letter) {
      return "correct";
    } else if (this.context.solution.word.includes(letter)) {
      return "present";
    }
    return "absent";
  };
}

class Letter {
  letter: string;
  status: LetterStatus;
  constructor(letter: string, status: LetterStatus) {
    this.letter = letter.toUpperCase();
    this.status = status;
  }
  setStatus(status: LetterStatus) {
    this.status = status;
  }
}
