"use client";
import React, { useCallback } from "react";
import { createContext, useContext, useState } from "react";
import { Word } from "@/game/WordleGame";

type KeyboardContextType = {
  lettersEntered: string[];
  deleteLetter: () => void;
  addLetter: (letter: string) => void;
  clearLetters: () => void;
};
interface KeyboardProviderProps {
  solution: Word;
  children: React.ReactNode;
}
const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined
);

export const KeyboardProvider = ({
  children,
  solution,
}: KeyboardProviderProps) => {
  const [lettersEntered, setLettersEntered] = useState<string[]>([]);

  const addLetter = useCallback(
    (letter: string) => {
      if (solution.letters.length === lettersEntered.length) {
        return;
      }
      setLettersEntered((prev) => [...prev, letter]);
    },
    [solution.letters.length, lettersEntered.length]
  );
  const deleteLetter = useCallback(() => {
    setLettersEntered((prev) => [...prev.slice(0, prev.length - 1)]);
  }, []);
  const clearLetters = useCallback(() => {
    setLettersEntered([]);
  }, []);

  const value = { lettersEntered, addLetter, deleteLetter, clearLetters };

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
