import { RefreshCcw } from "lucide-react";

interface GameHeaderProps {
  winCount: number;
  onRestart: () => void;
}
export const GameHeader = ({ winCount, onRestart }: GameHeaderProps) => {
  return (
    <div className="p-5 flex items-center justify-evenly w-full">
      <h2>Wins: {winCount}</h2>
      <button
        onClick={onRestart}
        className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"
      >
        <RefreshCcw size={18} />
      </button>
    </div>
  );
};
