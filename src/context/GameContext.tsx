"use client";
import { Word, WordleGame } from "@/game/WordleGame";
import { WordService } from "@/services/WordService";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface GameProviderProps {
  children: React.ReactNode;
}
interface GameContextType {
  winCount: number;
  solution: Word;
  guesses: Word[];
  makeGuess: (guess: string) => void;
  startGame: () => void;
  isLoading: boolean;
  wordLength: number;
  isPlaying: boolean;
  error: string | null;
}
const WORD_LENGTH = 5;
const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: GameProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const game = useMemo(() => new WordleGame(), []);

  const makeGuess = useCallback(
    (guess: string) => {
      game.addGuess(guess);
    },
    [game]
  );

  const startGame = useCallback(async () => {
    try {
      setIsLoading(true);
      const newWord = await WordService.getWordOfTheDay();

      game.start(newWord);
    } catch (error) {
      const errorMessaqe =
        error instanceof Error
          ? error.message
          : "An error occurred while retrieving word of the day";
      console.error(errorMessaqe);
      setError(errorMessaqe);
    } finally {
      setIsLoading(false);
    }
  }, [game]);

  const value = {
    isLoading,
    guesses: game.guesses,
    wordLength: WORD_LENGTH,
    makeGuess,
    startGame,
    solution: game.solution || new Word("", game),
    winCount: game.wins,
    isPlaying: game.state === "playing",
    error,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
