import React, { useMemo } from "react";

import { useGame, useKeyboard } from "@/context";
import { EmptyTile, KeyTile, LetterTile } from "./";

interface RowProps {
  index: number;
}
export const Row = ({ index }: RowProps) => {
  const { solution, guesses } = useGame();
  const { lettersEntered } = useKeyboard();

  const status = useMemo(() => {
    if (index === guesses.length) {
      return "active";
    } else if (index > guesses.length) {
      return "inactive";
    }
    return "completed";
  }, [index, guesses.length]);

  if (status === "inactive") {
    return (
      <div className="gap-2 flex">
        {solution.letters.map((_, i) => (
          <EmptyTile key={i} />
        ))}
      </div>
    );
  } else if (status === "completed") {
    return (
      <div className="gap-2 flex">
        {guesses?.[index].letters.map((letter, i) => (
          <LetterTile key={i} letter={letter} />
        ))}
      </div>
    );
  }
  return (
    <div className="gap-2 flex">
      {solution.letters.map((_, i) => {
        if (lettersEntered[i]) {
          return <KeyTile key={i} letter={lettersEntered[i]} />;
        }
        return <EmptyTile key={i} />;
      })}
    </div>
  );
};
