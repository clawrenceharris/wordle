/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@/types";
import { err, ok, Result } from "neverthrow";

const FALLBACK = "Something went wrong. Please try again.";

/** Errors that must not be shown to users */
const INTERNAL = [
  /row[- ]level security/i,
  /postgres/i,
  /sql/i,
  /relation .* does not exist/i,
  /permission denied/i,
  /violates/i,
  /duplicate key/i,
  /rpc/i,
  /syntax/i,
];

// Friendly mapping for common Postgres / PostgREST messages
const PG_PATTERNS: Record<string, RegExp> = {
  NOT_FOUND: /no rows|does not exist|not found/i,
  RLS: /row[- ]level security/i,
  PERMISSION: /permission denied/i,
  UNIQUE: /duplicate key|already exists/i,
  INVALID: /invalid input/i,
};

function sanitize(msg: string | null | undefined): string {
  if (!msg) return FALLBACK;

  // Hide dangerous internal details
  for (const p of INTERNAL) {
    if (p.test(msg)) return FALLBACK;
  }

  // Avoid exposing JSON blobs
  if (msg.startsWith("{") || msg.startsWith("[")) return FALLBACK;

  // Avoid long tech messages
  if (msg.length > 250) return FALLBACK;

  return msg;
}

/**
 * Normalizes any error (Supabase, fetch, Zod, JS) into a safe AppError.
 */
export function normalizeError(error: unknown): AppError {
  const message = sanitize(extractMessage(error));

  let status: number | undefined = undefined;

  // Supabase-style error objects
  if (isSupabaseError(error)) {
    const e = error as any;
    status = e.status;

    const raw = sanitize(e.message || e.error || message);

    if (PG_PATTERNS.NOT_FOUND.test(raw)) {
      return {
        code: "NOT_FOUND",
        userMessage: "The requested item was not found.",
        status,
        cause: error,
      };
    }

    if (PG_PATTERNS.PERMISSION.test(raw) || PG_PATTERNS.RLS.test(raw)) {
      return {
        code: "FORBIDDEN",
        userMessage: "You don’t have permission to do that.",
        status,
        cause: error,
      };
    }

    if (PG_PATTERNS.UNIQUE.test(raw)) {
      return {
        code: "ALREADY_EXISTS",
        userMessage: "This already exists.",
        status,
        cause: error,
      };
    }

    if (PG_PATTERNS.INVALID.test(raw)) {
      return {
        code: "INVALID_INPUT",
        userMessage: "Some of the provided information is invalid.",
        status,
        cause: error,
      };
    }

    return {
      code: "SUPABASE_ERROR",
      userMessage: raw || FALLBACK,
      status,
      cause: error,
    };
  }

  // Fetch / Response API errors
  if (isResponseLike(error)) {
    const r = error as Response;
    status = r.status;

    if (status === 404) {
      return {
        code: "NOT_FOUND",
        userMessage: "We couldn't find that resource.",
        status,
        cause: error,
      };
    }

    if (status === 403) {
      return {
        code: "FORBIDDEN",
        userMessage: "You don't have permission to access this.",
        status,
        cause: error,
      };
    }

    if (status >= 500) {
      return {
        code: "SERVER_ERROR",
        userMessage: "The server is having trouble. Try again later.",
        status,
        cause: error,
      };
    }

    return {
      code: "NETWORK_ERROR",
      userMessage: "Cannot reach the server.",
      status,
      cause: error,
    };
  }

  //  Zod validation errors
  if (isZodLike(error)) {
    return {
      code: "VALIDATION_ERROR",
      userMessage: extractZodMessage(error),
      cause: error,
    };
  }

  // JavaScript Error
  if (error instanceof Error) {
    return {
      code: error.name || "JS_ERROR",
      userMessage: message,
      cause: error,
    };
  }

  // Generic objects with message-like keys
  if (typeof error === "object" && error !== null) {
    const e = error as any;
    const msg =
      e.message || e.error || e.detail || e.details || message || FALLBACK;

    return {
      code: "GENERIC",
      userMessage: sanitize(msg),
      cause: error,
    };
  }

  // Final fallback
  return {
    code: "UNKNOWN",
    userMessage: FALLBACK,
    cause: error,
  };
}

/** Extract readable message safely */
function extractMessage(err: unknown): string {
  if (!err) return FALLBACK;

  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  if (typeof err === "object" && err !== null) {
    const e = err as any;
    return (
      e.message ||
      e.error ||
      e.detail ||
      e.details ||
      JSON.stringify(e, null, 2)
    );
  }

  return FALLBACK;
}

/** Type guards */
function isSupabaseError(err: unknown): err is { status: number } {
  if (!err || typeof err !== "object") return false;
  const e = err as any;
  return (
    typeof e.status === "number" &&
    (typeof e.message === "string" || typeof e.error === "string")
  );
}

function isResponseLike(err: unknown): err is Response {
  return (
    err instanceof Response ||
    (typeof err === "object" &&
      err !== null &&
      typeof (err as any).status === "number" &&
      typeof (err as any).text === "function")
  );
}

function isZodLike(err: unknown): err is { issues: any[] } {
  return (
    typeof err === "object" &&
    err !== null &&
    Array.isArray((err as any).issues)
  );
}

function extractZodMessage(err: any): string {
  return err.issues.map((i: any) => i.message).join("\n");
}
export async function safeResult<T>(
  fn: () => Promise<T>
): Promise<Result<T, AppError>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(normalizeError(e));
  }
}
