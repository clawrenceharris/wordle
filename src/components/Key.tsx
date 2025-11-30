import React from "react";
import { cn } from "@/lib/utils";
import { KeyStatus } from "./";
import { Delete } from "lucide-react";
import { getTileBackgroundColor } from "@/utils";

interface KeyProps {
  myKey: string;
  isSpecial: boolean;
  status: KeyStatus;
  onKeyPress: (key: string) => void;
  disabled: boolean;
}
export const Key = ({
  isSpecial,
  disabled,
  onKeyPress,
  status,
  myKey,
}: KeyProps) => {
  return (
    <button
      key={myKey}
      disabled={disabled}
      onClick={() => onKeyPress(myKey)}
      className={cn(
        "rounded-md  min-w-10 md:min-w-13 h-13 font-semibold uppercase flex items-center justify-center transition-colors duration-200",
        isSpecial ? "px-3 text-sm " : " text-base",
        getTileBackgroundColor(status)
      )}
    >
      {myKey === "Backspace" ? <Delete /> : myKey === "Enter" ? "Enter" : myKey}
    </button>
  );
};
