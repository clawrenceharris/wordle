import { useGame, useKeyboard, usePlayer } from "@/context";
import { Tile } from ".";
import { motion } from "framer-motion";
import { TileFlip } from "./TileFlip";
import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { GuessWithFeedback } from "@/types";
import { WordleGame } from "@/game";

interface RowProps {
  index: number;
  guesses: GuessWithFeedback[];
  length: number;
  letters: string[];
  showLetters?: boolean;
  disabled?: boolean;
  onAnimationComplete?: () => void;
}

const Row = ({
  index,
  letters,
  length,
  onAnimationComplete,
  guesses,
  showLetters,
}: RowProps) => {
  if (index > guesses.length) {
    // Row is not in focus yet
    return (
      <div className="gap-2 flex">
        {[...Array(length)].map((_, i) => (
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
        {guesses[index].map((l, i) => (
          <TileFlip
            index={i}
            onAnimationComplete={() =>
              i + 1 >= length && onAnimationComplete?.()
            }
            key={i}
            letter={showLetters ? l.letter : null}
            status={l.status}
          />
        ))}
      </div>
    );
  }

  return (
    // Row is in focus
    <div className="gap-2 uppercase flex">
      {[...Array(length)].map((_, i) => {
        if (letters[i] && showLetters) {
          return (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <div className="tile-container bg-border">
                <Tile letter={showLetters ? letters[i] : null} />
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
interface WordleBoardProps {
  disabled?: boolean;
  game: WordleGame | null;
  isCurrentUser?: boolean;
  className?: string;
  userId?: string | null;
}
export const WordleBoard = ({
  game,
  className,
  userId,
  disabled,
}: WordleBoardProps) => {
  const { message, clearMessage, showMessage } = useGame();
  const { lettersEntered } = useKeyboard();
  const { playerId } = usePlayer();

  const isCurrentUser = useMemo(() => playerId === userId, [playerId, userId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      clearMessage();
    }, 2400);
    return () => clearTimeout(timeout);
  }, [clearMessage, message]);

  // Shows messages when the user enters guess
  const handleMessageAfterGuess = () => {
    if (!game) return;
    if (!game.isOver()) return;

    if (isCurrentUser) {
      //only show these if this isn't the current user board
      if (!game.isSolved())
        return showMessage("You lost. The word was " + game.solution);
      if (game.guesses.length === 6) return showMessage("Phew!");
      if (game.guesses.length >= 4) return showMessage("Great job!");
      if (game.guesses.length >= 2) return showMessage("Genius!");
      if (game.guesses.length === 1) return showMessage("Lucky!");
    } else if (game.isSolved()) {
      return showMessage("You lost this match. The word was " + game.solution);
    }
  };
  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-sm mx-auto flex-col gap-2",
        className
      )}
    >
      {message && isCurrentUser && (
        <h3 className="absolute z-9 text-md text-nowrap shadow-md  -top-10  rounded-md bg-foreground text-background p-3">
          {message}
        </h3>
      )}
      {!userId && (
        <h3 className="absolute z-9 text-md text-nowrap shadow-md -top-10 rounded-md bg-foreground text-background p-3">
          Waiting for player...
        </h3>
      )}
      {[...Array(game?.maxGuesses || 6)].map((_, i) => (
        <React.Fragment key={i}>
          {game ? (
            <Row
              letters={lettersEntered}
              showLetters={isCurrentUser} //only show letter input if this is the current user's board
              guesses={game.guesses}
              length={game.solution.length}
              disabled={disabled}
              index={i}
              onAnimationComplete={handleMessageAfterGuess}
              key={i}
            />
          ) : (
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="tile-container bg-tile-absent">
                  <Tile className="bg-tile-absent" status="empty" />
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
