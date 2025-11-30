import { MatchService } from "@/services/match-service";
import { GameStatus, GuessWithFeedback, Match } from "@/types";
import { pickWordFromSeed, toGuessWithFeedback } from "@/utils";

export class WordleGame {
  seed: Date | string;
  maxGuesses: number = 6;
  solution: string;
  guesses: GuessWithFeedback[] = [];
  playerId: string;
  status: GameStatus = "playing";
  winner: string | null = null;

  constructor(playerId: string, seed: Date | string, guesses: string[] = []) {
    this.seed = seed;
    this.playerId = playerId;
    this.solution = pickWordFromSeed(this.seed);

    this.guesses = guesses.map((guess) => {
      return toGuessWithFeedback(guess, this.solution);
    });
  }

  async addGuess(guess: string) {
    const newGuess = toGuessWithFeedback(guess, this.solution);
    this.guesses = [...this.guesses, newGuess];
  }
  isSolved() {
    return this.guesses.some((guess) =>
      guess.every((letter) => letter.status === "correct")
    );
  }
  isOver() {
    return this.isSolved() || this.guesses.length >= this.maxGuesses;
  }
}

export class WordleMatch extends WordleGame {
  match: Match;
  winner: string | null = null;
  constructor(match: Match, playerId: string) {
    super(playerId, match.code, match.guesses?.[playerId] || []);
    this.match = match;
    this.playerId = playerId;
  }

  override isOver() {
    const opponentId = this.match.players.find((id) => id !== this.playerId);
    if (!opponentId) return false;
    const opponentSolved = (this.match.guesses?.[opponentId] || []).some(
      (g) => g === this.solution
    );
    if (this.isSolved() || opponentSolved) {
      return true;
    }

    return (
      this.match.guesses[opponentId]?.length >= this.maxGuesses &&
      this.match.guesses[this.playerId]?.length >= this.maxGuesses
    );
  }
  async addGuess(guess: string) {
    // Builds the optimistic feedback locally so the UI updates immediately
    const newGuess = toGuessWithFeedback(guess, this.solution);

    // Snapshots to allow revert if the network call fails
    const prevGuesses = [...this.guesses];
    const prevMatchGuesses = {
      ...this.match.guesses,
      [this.playerId]: [...(this.match.guesses?.[this.playerId] || [])],
    };

    // Optimistically update local state
    this.guesses = [...this.guesses, newGuess];
    this.match.guesses = {
      ...this.match.guesses,
      [this.playerId]: [...(this.match.guesses?.[this.playerId] || []), guess],
    };

    try {
      // Persist to server
      await MatchService.addGuess(this.match.code, this.playerId, guess);
    } catch (err) {
      // Revert local optimistic update on failure
      this.guesses = prevGuesses;
      this.match.guesses = prevMatchGuesses;
      throw err;
    }
  }
}
