import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wordle",
  description: "Play the popular game Wordle. What word will you reveal?",
};

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center">
      <Link href="/game" className="btn btn-primary">
        Start Game
      </Link>
    </div>
  );
}
