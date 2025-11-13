import { cn } from "@/lib/utils";
import { LetterStatus } from "@/types";
import { KeyStatus } from "./Keyboard";
import { forwardRef } from "react";

interface TileProps {
  letter?: string;
  status?: LetterStatus | KeyStatus;
  className?: string;
}

// eslint-disable-next-line react/display-name
export const Tile = forwardRef<HTMLDivElement, TileProps>(
  ({ letter, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "tile bg-background w-full h-full flex items-center justify-center  font-bold text-lg  md:text-xl",
          className
        )}
      >
        {letter}
      </div>
    );
  }
);
