"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

export type PlayerStatistics = {
  totalWins: number;
  streak: number;
};

type PlayerContextValue = {
  playerId: string;
  statistics: PlayerStatistics;
  updateStatistics: (
    updater: (prev: PlayerStatistics) => PlayerStatistics
  ) => void;
  resetStatistics: () => void;
};
interface PlayerProviderProps {
  children: ReactNode;
}
const PLAYER_ID_KEY = "playerId";
const PLAYER_STATS_KEY = "playerStatistics";

const defaultStats: PlayerStatistics = { totalWins: 0, streak: 0 };

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const playerId = useMemo(() => {
    const id = crypto.randomUUID();
    try {
      const stored = localStorage.getItem("playerId");
      if (stored) return stored;
      localStorage.setItem("playerId", id);
    } catch {}
    return id;
  }, []);

  const [statistics, setStatistics] = useState<PlayerStatistics>(() => {
    try {
      if (typeof window === "undefined") return defaultStats;
      const raw = localStorage.getItem(PLAYER_STATS_KEY);
      return raw ? (JSON.parse(raw) as PlayerStatistics) : defaultStats;
    } catch {
      return defaultStats;
    }
  });

  useEffect(() => {
    try {
      if (playerId === null) {
        localStorage.removeItem(PLAYER_ID_KEY);
      } else {
        localStorage.setItem(PLAYER_ID_KEY, playerId);
      }
    } catch {
      /* ignore storage errors */
    }
  }, [playerId]);

  useEffect(() => {
    try {
      localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(statistics));
    } catch {
      /* ignore storage errors */
    }
  }, [statistics]);

  const updateStatistics = (
    updater: (prev: PlayerStatistics) => PlayerStatistics
  ) => {
    setStatistics((prev) => {
      const next = updater(prev);
      // ensure values are reasonable (non-negative integers)
      return {
        totalWins: Math.max(0, Math.floor(next.totalWins)),
        streak: Math.max(0, Math.floor(next.streak)),
      };
    });
  };

  const resetStatistics = () => setStatistics(defaultStats);

  return (
    <PlayerContext.Provider
      value={{ playerId, statistics, updateStatistics, resetStatistics }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
};
