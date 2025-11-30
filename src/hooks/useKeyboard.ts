import { useCallback, useState } from "react";

interface UseKeyboardOptions {
  disabled: boolean;
  maxLetters: number;
}

export const useKeyboard = ({ disabled, maxLetters }: UseKeyboardOptions) => {
  const [lettersEntered, setLettersEntered] = useState<string[]>([]);
  const addLetter = useCallback(
    (letter: string) => {
      if (disabled) return;
      if (maxLetters === lettersEntered.length) return;

      setLettersEntered((prev) => [...prev, letter]);
    },
    [disabled, lettersEntered.length, maxLetters]
  );
  const deleteLetter = useCallback(() => {
    setLettersEntered((prev) => [...prev.slice(0, prev.length - 1)]);
  }, []);
  const clearLetters = useCallback(() => {
    setLettersEntered([]);
  }, []);

  return {
    lettersEntered,
    addLetter,
    deleteLetter,
    clearLetters,
  };
};
