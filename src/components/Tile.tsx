import { cn } from "@/lib/utils";
import { LetterStatus } from "@/types";
import { KeyStatus } from "./Keyboard";
import { forwardRef } from "react";

interface TileProps {
  letter?: string | null;
  status?: LetterStatus | KeyStatus;
  className?: string;
}

// eslint-disable-next-line react/display-name
export const Tile = forwardRef<HTMLDivElement, TileProps>(
  ({ letter, className }, ref) => {
    return (
      <div ref={ref} className={cn("tile bg-background", className)}>
        {letter}
      </div>
    );
  }
);
