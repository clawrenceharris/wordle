"use client";
import { Word, WordleGame } from "@/game/WordleGame";
import { useWordle } from "@/hooks/useWordle";
import { GameState } from "@/types/game";
import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";

interface GameProviderProps {
  children: React.ReactNode;
}
interface GameContextType {
  winCount: number;
  solution: Word | null;
  guesses: Word[];
  makeGuess: (guess: string) => Promise<void>;
  startGame: () => void;
  changeDate: (date: Date) => void;
  isLoading: boolean;
  wordLength: number;
  isPlaying: boolean;
  error: string | null;
}
const WORD_LENGTH = 5;
const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: GameProviderProps) => {
  const [winCount, setWinCount] = useState(0);
  const [date, setDate] = useState<Date>(new Date());
  const { validateWord, wotd, isLoading, error } = useWordle(date);

  function gameReducer(
    game: WordleGame,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: { type: "win" | "guess" | "start"; payload?: any }
  ): WordleGame {
    switch (action.type) {
      case "win":
        setWinCount((prev) => prev + 1);
        return game;
      case "start":
        return game.start(action.payload);
      case "guess":
        return game.makeGuess(action.payload);
      default:
        return game;
    }
  }

  const [game, dispatch] = useReducer(gameReducer, new WordleGame());

  const makeGuess = useCallback(
    async (guess: string) => {
      const validWord = await validateWord(guess);
      if (!validWord) return;
      dispatch({ type: "guess", payload: new Word(guess, game) });
    },
    [game, validateWord]
  );
  const changeDate = useCallback((date: Date) => {
    setDate(date);
  }, []);
  const startGame = useCallback(async () => {
    if (wotd) dispatch({ type: "start", payload: wotd });
  }, [wotd]);

  const value = {
    isLoading,
    guesses: game.guesses,
    wordLength: WORD_LENGTH,
    makeGuess,
    startGame,
    changeDate,
    solution: game.solution,
    winCount,
    isPlaying: game.state === GameState.PLAYING,
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
