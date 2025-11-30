"use client";
import React, { useCallback, useMemo } from "react";
import { createContext, useContext, useState } from "react";
import { useGame } from "./GameContext";

type KeyboardContextType = {
  lettersEntered: string[];
  deleteLetter: () => void;
  addLetter: (letter: string) => void;
  clearLetters: () => void;
  disabled: boolean;
};
interface KeyboardProviderProps {
  children: React.ReactNode;
}
const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined
);

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const { game } = useGame();
  const [lettersEntered, setLettersEntered] = useState<string[]>([]);
  const disabled = useMemo(() => game.isOver(), [game]);

  const addLetter = useCallback(
    (letter: string) => {
      if (disabled || game.solution.length === lettersEntered.length) return;
      setLettersEntered((prev) => [...prev, letter]);
    },
    [disabled, game.solution.length, lettersEntered.length]
  );
  const deleteLetter = useCallback(() => {
    setLettersEntered((prev) => [...prev.slice(0, prev.length - 1)]);
  }, []);
  const clearLetters = useCallback(() => {
    setLettersEntered([]);
  }, []);

  const value = {
    lettersEntered,
    disabled,
    addLetter,
    deleteLetter,
    clearLetters,
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
};
