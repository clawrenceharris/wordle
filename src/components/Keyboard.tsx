import React, { useCallback, useEffect } from "react";
import { Key } from "@/components";
import { useKeyboard } from "@/context";
import { GuessWithFeedback, LetterStatus } from "@/types";

export type KeyStatus = "absent" | "present" | "correct" | "default";
const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];
interface KeyboardProps {
  onSubmit: (word: string) => void;
  guesses: GuessWithFeedback[];
}
export const Keyboard = ({ onSubmit, guesses }: KeyboardProps) => {
  const { addLetter, disabled, deleteLetter, lettersEntered } = useKeyboard();
  const handleKeyPressed = useCallback(
    async (key: string) => {
      if (disabled) {
        return;
      }
      if (key === "Enter") {
        return onSubmit(lettersEntered.join("").toUpperCase());
      }
      if (key === "Backspace") {
        return deleteLetter();
      }

      addLetter(key);
    },
    [addLetter, deleteLetter, disabled, lettersEntered, onSubmit]
  );
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[a-zA-Z]$/.test(key) || key === "Enter" || key === "Backspace") {
        e.preventDefault();
        handleKeyPressed(key);
      }
    };
    window.addEventListener("keyup", handleKeyDown);
    return () => window.removeEventListener("keyup", handleKeyDown);
  }, [handleKeyPressed]);

  const checkLetterFeedback = (letter: string, feedback: LetterStatus) => {
    return guesses.some((g) =>
      g.some((l) => l.letter === letter && l.status === feedback)
    );
  };

  const getKeyStatus = (key: string): KeyStatus => {
    if (checkLetterFeedback(key, "correct")) {
      return "correct";
    } else if (checkLetterFeedback(key, "present")) {
      return "present";
    } else if (checkLetterFeedback(key, "absent")) {
      return "absent";
    } else {
      return "default";
    }
  };
  return (
    <div className="flex flex-col scale-[0.8] md:scale-[1] text-foreground items-center gap-3 select-none">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5">
          {row.map((key) => {
            const isSpecial = key === "Enter" || key === "Backspace";

            return (
              <Key
                disabled={disabled && !isSpecial}
                status={isSpecial ? "default" : getKeyStatus(key)}
                myKey={key}
                key={key}
                isSpecial={isSpecial}
                onKeyPress={handleKeyPressed}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
