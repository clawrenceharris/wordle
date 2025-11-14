import { RefreshCcw } from "lucide-react";

interface GameHeaderProps {
  winCount: number;
  onRestart: () => void;
}
export const GameHeader = ({ winCount, onRestart }: GameHeaderProps) => {
  return (
    <div className="flex items-center justify-evenly w-full">
      <h2>Wins: {winCount}</h2>
      <button
        onClick={onRestart}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
      >
        <RefreshCcw />
      </button>
    </div>
  );
};
