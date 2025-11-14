import React, { useCallback, useEffect } from "react";
import { Key } from "./";
import { useGame, useKeyboard } from "@/context";
export type KeyStatus = "absent" | "present" | "correct" | "default";
const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export const Keyboard = () => {
  const { addLetter, deleteLetter, clearLetters, lettersEntered } =
    useKeyboard();
  const { makeGuess, guesses, isPlaying } = useGame();
  const handleKeyPressed = useCallback(
    (key: string) => {
      if (!isPlaying) {
        return;
      }
      if (key === "Enter") {
        makeGuess(lettersEntered.join(""));
        clearLetters();
      } else if (key === "Backspace") {
        deleteLetter();
      } else {
        addLetter(key);
      }
    },
    [
      isPlaying,
      makeGuess,
      lettersEntered,
      clearLetters,
      deleteLetter,
      addLetter,
    ]
  );
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) || key === "ENTER" || key === "BACKSPACE") {
        e.preventDefault();
        handleKeyPressed(
          key === "ENTER" ? "Enter" : key === "BACKSPACE" ? "Backspace" : key
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPressed]);
  const getKeyStatus = (key: string): KeyStatus => {
    if (
      guesses.some((w) =>
        w.letters.some((l) => l.letter === key && l.status === "correct")
      )
    ) {
      return "correct";
    } else if (
      guesses.some((w) =>
        w.letters.some((l) => l.letter === key && l.status === "present")
      )
    )
      return "present";
    else if (
      guesses.some((w) =>
        w.letters.some((l) => l.letter === key && l.status === "absent")
      )
    )
      return "absent";
    else {
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
