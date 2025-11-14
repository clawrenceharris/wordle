import { useMemo } from "react";

import { useGame, useKeyboard } from "@/context";
import { Tile } from "./";

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
          <Tile
            className="border-2 border-tile-border"
            status="empty"
            key={i}
          />
        ))}
      </div>
    );
  } else if (status === "completed") {
    return (
      <div className="gap-2 flex">
        {guesses?.[index].letters.map((letter, i) => (
          <Tile key={i} letter={letter.letter} status={letter.status} />
        ))}
      </div>
    );
  }
  return (
    <div className="gap-2 flex">
      {solution.letters.map((_, i) => {
        if (lettersEntered[i]) {
          return (
            <Tile
              className="border-2 border-tile-border"
              key={i}
              letter={lettersEntered[i]}
            />
          );
        }
        return (
          <Tile
            className="border-2 border-tile-border"
            status="empty"
            key={i}
          />
        );
      })}
    </div>
  );
};
