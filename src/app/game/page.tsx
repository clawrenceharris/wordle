import { GameProvider } from "@/context";
import GamePage from "./GamePage";

export default function Page() {
  return (
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
}
