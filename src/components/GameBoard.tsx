import { useGame, useKeyboard } from "@/context";
import { Tile } from "./";
import { motion } from "framer-motion";
import { TileFlip } from "./TileFlip";

interface RowProps {
  index: number;
}

const Row = ({ index }: RowProps) => {
  const { solution, guesses } = useGame();
  const { lettersEntered } = useKeyboard();

  if (!solution) {
    return null;
  }
  if (index > guesses.length) {
    // Row is not in focus yet
    return (
      <div className="gap-2 flex">
        {solution.letters.map((_, i) => (
          <div key={i} className="tile-container">
            <Tile status="empty" />
          </div>
        ))}
      </div>
    );
  } else if (index < guesses.length) {
    // Row is completed
    return (
      <div className="gap-2 flex perspective-[600px]">
        {guesses[index].letters.map((letter, i) => (
          <TileFlip
            index={i}
            key={i}
            letter={letter.letter}
            status={letter.status}
          />
        ))}
      </div>
    );
  }

  return (
    // Row is in focus
    <div className="gap-2 flex">
      {solution.letters.map((_, i) => {
        if (lettersEntered[i]) {
          return (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <div className="tile-container bg-border">
                <Tile letter={lettersEntered[i]} />
              </div>
            </motion.div>
          );
        }
        return (
          <div key={i} className="tile-container">
            <Tile status="empty" />
          </div>
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
