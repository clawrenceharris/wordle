import { Match } from "@/types";
import { supabase } from "@/lib/supabase";

export const MatchService = {
  async createMatch(
    code: string,
    playerId: string,
    solution: string
  ): Promise<Match> {
    const { data: match, error } = await supabase
      .from("matches")
      .insert({
        solution,
        code,
        players: [playerId],
        status: "playing",
      })
      .select()
      .single();
    if (error) throw error;
    return match;
  },

  async deleteMatch(code: string): Promise<void> {
    const { error } = await supabase.from("matches").delete().eq("code", code);

    if (error) throw error;
  },

  async joinMatch(code: string, playerId: string): Promise<Match> {
    const { data: match, error } = await supabase
      .from("matches")
      .select()
      .eq("code", code)
      .maybeSingle();

    if (error) throw error;
    if (!match) {
      throw new Error("Match not found.");
    }
    const current = match["players"] || [];

    if (current.includes(playerId)) {
      return match; //player already joined, exit function
    }
    if (current.length >= 2) {
      throw new Error("This match is full");
    }
    const updated = [...current, playerId];

    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({ players: updated })
      .select()
      .eq("code", code)
      .single();

    if (updateError) throw updateError;
    return updatedMatch;
  },
  async leaveMatch(code: string, playerId: string): Promise<Match> {
    const { data: match, error } = await supabase
      .from("matches")
      .select()
      .eq("code", code)
      .maybeSingle();

    if (error) throw error;
    if (!match) {
      throw new Error("Match not found.");
    }
    const current = match["players"] || [];

    if (!current.includes(playerId)) {
      return match; //player already joined, exit function
    }

    const updated = current.filter((id: string) => id !== playerId);

    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({ players: updated })
      .select()
      .eq("code", code)
      .single();

    if (updateError) throw updateError;
    return updatedMatch;
  },
  async addGuess(
    code: string,
    playerId: string,
    guess: string
  ): Promise<Match> {
    const { data: match, error } = await supabase
      .from("matches")
      .select()
      .eq("code", code)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!match) throw new Error("Match not found.");

    const current = match["guesses"] || {};
    const updated = {
      ...current,
      [playerId]: [...(current?.[playerId] || []), guess],
    };
    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({ guesses: updated })
      .select()
      .eq("code", code)
      .single();

    if (updateError) throw updateError;
    return updatedMatch;
  },

  async finishMatch(code: string): Promise<Match> {
    const { data: match, error } = await supabase
      .from("matches")
      .update({ status: "finished" })
      .select()
      .eq("code", code)
      .single();
    if (error) throw error;
    return match;
  },

  async getMatch(code: string): Promise<Match> {
    const { data: match, error } = await supabase
      .from("matches")
      .select()
      .eq("code", code)
      .single();
    if (error || !match) throw error;
    return match;
  },

  subscribe(code: string, onUpdate: (match: Match) => void) {
    return supabase
      .channel(`match-${code}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `code=eq.${code}`,
        },
        (payload) => {
          onUpdate(payload.new as Match);
        }
      )
      .subscribe();
  },
};
