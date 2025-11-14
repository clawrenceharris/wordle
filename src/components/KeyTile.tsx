import React from "react";

export interface FocusedTileProps {
  letter: string;
}

export const KeyTile = ({ letter }: FocusedTileProps) => {
  return (
    <div className="w-15 h-15 rounded-md border-2 border-border flex items-center justify-center">
      {letter}
    </div>
  );
};
