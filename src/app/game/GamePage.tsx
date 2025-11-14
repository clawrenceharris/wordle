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
      <div className="p-5 items-center flex gap-10 flex-col  text-center mx-auto">
        <GameHeader winCount={winCount} onRestart={startGame} />
        <GameBoard />
        <Keyboard />
      </div>
    </KeyboardProvider>
  );
}
