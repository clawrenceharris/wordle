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
      <div className=" w-full max-w-sm gap-10 space-y-6  text-center mx-auto">
        <GameHeader winCount={winCount} onRestart={startGame} />
        <GameBoard />
        <Keyboard />
      </div>
    </KeyboardProvider>
  );
}
