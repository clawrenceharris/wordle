"use client";
import { KeyboardProvider, useGame } from "@/context";
import { GameBoard, GameHeader, Keyboard } from "@/components";
import { useEffect } from "react";

export default function GamePage() {
  const { startGame, solution, winCount } = useGame();
  useEffect(() => {
    startGame();
  }, [startGame]);
  if (!solution) {
    return null;
  }
  return (
    <KeyboardProvider solution={solution}>
      <div className="flex flex-col w-full h-full max-w-sm gap-9 md:gap-10 justify-evenly text-center mx-auto">
        <GameHeader winCount={winCount} onRestart={startGame} />

        <GameBoard />
        <Keyboard />
      </div>
    </KeyboardProvider>
  );
}
