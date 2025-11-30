"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { wordService } from "@/services";
import { WordleMatch, WordleGame } from "@/game";
import { usePlayer, useMatch } from "@/context";

interface GameContextProps {
  game: WordleGame;
  date: Date;
  isGameOver: boolean;
  message: string | null;

  clearMessage: () => void;
  showMessage: (message: string) => void;
  changeDate: (date: Date) => void;
  submitGuess: (word: string) => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const { match } = useMatch();
  const { playerId } = usePlayer();
  const [date, setDate] = useState<Date>(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem("wordleDate");
    } catch {}
    return stored ? new Date(stored) : new Date();
  });

  const game = useMemo(() => {
    if (match) {
      const newGame = new WordleMatch(match, playerId);

      return newGame;
    } else {
      const seed = date.toISOString().slice(0, 10);
      const newGame = new WordleGame(playerId, seed);
      return newGame;
    }
  }, [date, match, playerId]);

  const isGameOver = useMemo(
    () => game.isOver() || game.status === "finished",
    [game]
  );

  const validateWord = useCallback(
    async (guess: string): Promise<void> => {
      if (!game) return;
      if (guess.length < game.solution.length) {
        throw new Error("Not enough letters");
      }

      const validEnglishWord = await wordService.validateWord(guess);
      if (!validEnglishWord) {
        throw new Error("Not in word list");
      }
    },
    [game]
  );

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const submitGuess = useCallback(
    async (guess: string) => {
      try {
        if (!game) return;
        await validateWord(guess);
        await game.addGuess(guess);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong.";
        setMessage(errorMessage);

        throw new Error(errorMessage); //rethrow error for calling function
      }
    },
    [game, validateWord]
  );

  const showMessage = useCallback((message: string) => {
    setMessage(message);
  }, []);

  const changeDate = useCallback((date: Date) => {
    setDate(date);
    // const seed = date.toISOString().slice(0, 10);
    // const newGame = new WordleGame(initialGameState, seed);
    // setGame(newGame);
  }, []);

  const value = {
    message,
    game,
    date,
    isGameOver,

    clearMessage,
    changeDate,
    submitGuess,
    showMessage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
