import React, { useState } from "react";
import { Button, Input, Label } from "./ui";
import { Copy, Loader2 } from "lucide-react";
import { useGame, useMatch } from "@/context";
import { cn } from "@/lib/utils";

interface CreateMatchModalProps {
  onSubmit: (code?: string) => void;
  onEndMatch: (code: string) => void;
}
export const CreateMatchModal = ({
  onSubmit,
  onEndMatch,
}: CreateMatchModalProps) => {
  const [code, setCode] = useState<string>("");
  const { match, isLoading, copyCode } = useMatch();
  const { isGameOver } = useGame();

  return (
    <>
      {match ? (
        <div className="text-center mt-4 space-y-5">
          <div className="space-y-2">
            <h2
              className={cn(
                " text-lg",
                !isGameOver ? "text-accent-400" : "text-destructive-400"
              )}
            >
              {!isGameOver ? "Match in Progress" : "Match Complete"}
            </h2>
            <p className="text-sm">Share this code:</p>
          </div>
          <div className="flex items-center gap-2 justify-center ">
            <Button onClick={copyCode} variant="ghost">
              <Copy />
              <p>{match.code}</p>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Label htmlFor="code" id="description">
            Know the code? Enter it here
          </Label>
          <div className="flex items-center gap-2">
            <Input
              className="uppercase placeholder:capitalize "
              type="text"
              id="code"
              placeholder="Enter a match code"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 mt-10">
        {code && !match && (
          <Button
            variant="secondary"
            onClick={() => {
              onSubmit(code.trim().toUpperCase());
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Join Match"}
          </Button>
        )}
        {!match ? (
          <Button onClick={() => onSubmit()}>New Match</Button>
        ) : (
          <Button
            variant="destructive"
            onClick={() => onEndMatch(match.code)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : isGameOver ? (
              "Leave"
            ) : (
              "Quit"
            )}
          </Button>
        )}
      </div>
    </>
  );
};
