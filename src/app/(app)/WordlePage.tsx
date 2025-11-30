"use client";

import { useMemo } from "react";
import { Keyboard, WordleBoard } from "@/components";
import { useGame, useKeyboard, useMatch, usePlayer } from "@/context";
import { Loader2 } from "lucide-react";
import { WordleMatch } from "@/game";

export default function WordlePage() {
  const { game, submitGuess } = useGame();

  const { clearLetters } = useKeyboard();
  const { playerId } = usePlayer();
  const { match, isLoading: matchLoading } = useMatch();

  const handleSubmit = async (guess: string) => {
    submitGuess(guess).then(clearLetters);
  };

  const opponentId = useMemo(
    () => match && match.players.find((id) => id != playerId),
    [match, playerId]
  );

  const opponentGame = useMemo(() => {
    if (match) {
      return opponentId ? new WordleMatch(match, opponentId) : null;
    }
    return null;
  }, [match, opponentId]);

  if (matchLoading)
    return (
      <div className="absolute -translate-1/2  top-1/2 left-1/2">
        <Loader2 size={45} className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col items-center h-full w-full gap-4 text-center ">
      <div className="flex flex-row mt-10 gap-5">
        <WordleBoard isCurrentUser userId={playerId} game={game} />

        {match && (
          <WordleBoard
            className="scale-70"
            disabled={!opponentGame}
            userId={opponentId}
            game={opponentGame}
          />
        )}
      </div>

      <Keyboard guesses={game.guesses || []} onSubmit={handleSubmit} />
    </div>
  );
}
