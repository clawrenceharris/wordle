import { cn } from "@/lib/utils";
import { Letter } from "@/types";
import { getStatusColor } from "@/utils";
import React from "react";

export interface LetterTileProps {
  letter: Letter;
}

export const LetterTile = ({ letter }: LetterTileProps) => {
  return (
    <h3
      className={cn(
        "w-15 h-15 rounded-md font-bold text-xl flex items-center justify-center",
        getStatusColor(letter.status)
      )}
    >
      {letter.letter}
    </h3>
  );
};
