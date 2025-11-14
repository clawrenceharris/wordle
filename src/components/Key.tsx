import React from "react";
import { cn } from "@/lib/utils";
import { KeyStatus } from "./";
import { getStatusColor } from "@/utils";
import { Delete } from "lucide-react";

interface KeyProps {
  myKey: string;
  isSpecial: boolean;
  onKeyPress: (key: string) => void;
  status: KeyStatus;
}
export const Key = ({ isSpecial, onKeyPress, status, myKey }: KeyProps) => {
  return (
    <button
      key={myKey}
      onClick={() => onKeyPress(myKey)}
      className={cn(
        "rounded-md  min-w-10 md:min-w-13 h-13 font-semibold uppercase flex items-center justify-center transition-colors duration-200",
        isSpecial ? "px-3 text-sm " : " text-base",
        getStatusColor(status)
      )}
    >
      {myKey === "Backspace" ? <Delete /> : myKey === "Enter" ? "Enter" : myKey}
    </button>
  );
};
