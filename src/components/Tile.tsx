import { cn } from "@/lib/utils";
import { LetterStatus } from "@/types";
import { getStatusColor } from "@/utils";
import { KeyStatus } from "./Keyboard";

export const Tile = ({
  letter,
  status,
  className,
}: {
  letter?: string;
  status?: LetterStatus | KeyStatus;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-9 h-9 md:w-13 md:h-13 rounded-md  flex items-center justify-center ",
        getStatusColor(status),
        className
      )}
    >
      {letter || null}
    </div>
  );
};
