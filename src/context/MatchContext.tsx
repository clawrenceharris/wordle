"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePlayer } from "./PlayerContext";
import { MatchService } from "@/services";
import { supabase } from "@/lib/supabase";
import { pickWordFromSeed } from "@/utils";
import { useAction } from "@/hooks";
import { Match } from "@/types";

interface MatchContextProps {
  match: Match | null;
  isLoading: boolean;
  startMatch: (code?: string) => Promise<Match | null>;
  leaveMatch: (code: string) => Promise<void>;
  deleteMatch: (code: string) => Promise<void>;
}

const MatchContext = createContext<MatchContextProps | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const { run, isLoading } = useAction();
  const { playerId } = usePlayer();
  useEffect(() => {
    if (!match?.code || match.status === "finished") return;
    const channel = MatchService.subscribe(match.code, (m) => {
      setMatch(m);
    });
    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  }, [match?.code, match?.status]);

  const leaveMatch = useCallback(
    async (code: string) => {
      await run(() => MatchService.leaveMatch(code, playerId));
      setMatch(null);
    },
    [playerId, run]
  );

  const deleteMatch = async (code: string) => {
    await run(() => MatchService.deleteMatch(code));
    setMatch(null);
  };

  const startMatch = useCallback(
    async (code?: string) => {
      const match = await run(() => {
        if (code) {
          return MatchService.joinMatch(code, playerId);
        } else {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          const solution = pickWordFromSeed(code);
          return MatchService.createMatch(code, playerId, solution);
        }
      });
      setMatch(match);
      return match;
    },
    [playerId, run]
  );

  const value = {
    match,
    isLoading,
    startMatch,
    leaveMatch,
    deleteMatch,
  };
  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
};

export const useMatch = () => {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatch must be used within MatchProvider");
  return ctx;
};
