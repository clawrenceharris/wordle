import { useGame, useKeyboard } from "@/context";
import { Tile } from "./";

interface RowProps {
  index: number;
}
const Row = ({ index }: RowProps) => {
  const { solution, guesses } = useGame();
  const { lettersEntered } = useKeyboard();

  if (index > guesses.length) {
    // Row is not in focus yet
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
  } else if (index < guesses.length) {
    // Row is in focus
    return (
      <div className="gap-2 font-bold  flex">
        {guesses?.[index].letters.map((letter, i) => (
          <Tile key={i} letter={letter.letter} status={letter.status} />
        ))}
      </div>
    );
  }

  return (
    // Row is completed
    <div className="gap-2 flex">
      {solution.letters.map((_, i) => {
        if (lettersEntered[i]) {
          return (
            <Tile
              className="border-2  border-tile-border"
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

export const GameBoard = () => {
  return (
    <div className="flex items-center w-full max-w-sm mx-auto flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <Row index={i} key={i} />
      ))}
    </div>
  );
};
