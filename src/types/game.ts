import { GuessWithFeedback } from "@/types";

export interface Match {
  code: string;
  guesses: Record<string, string[]>;
  solution: string;
  players: string[];
  status: GameStatus;
}
export type GameStatus = "playing" | "finished";
export interface GameState {
  maxGuesses: number;
  solution: string;
  guesses: GuessWithFeedback[];
  status: GameStatus;
  isSolved: boolean;

  opponentGuesses?: GuessWithFeedback[];
  matchCode?: string;

  isLoading: boolean;
}

export interface GameStateWithSolution extends GameState {
  solution: string;
}

export type GameAction =
  | { type: "start"; payload: string }
  | { type: "guess"; payload: string }
  | { type: "reset" }
  | { type: "end" };

export interface IWordleGame {
  // read-only state
  state: GameState;
  clone: () => IWordleGame;
  // methods
  startGame(): Promise<void>;
  addGuess(guess: string): Promise<void>;
  reset(): Promise<void>;

  // event subscription (optional)
  onChange?: (cb: (state: GameState) => void) => () => void;
}
