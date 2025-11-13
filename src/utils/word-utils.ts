// Lightweight deterministic string -> number hash (djb2-like) to produce a stable index.
// Avoids using Node's crypto.hash API which expects multiple arguments and returns non-number types.
const hashStringToInt = (s: string): number => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  // Ensure a non-negative 32-bit integer
  return h >>> 0;
};

/**
 * Determines the number of days a specific `Date` has been since 01/01/2000.
 * @param date The `Date` in question
 * @returns The number of days `date` has been since 01/01/2000.
 */
const getDayDiff = (date: Date): number => {
  return Math.floor(
    (date.valueOf() - new Date(2000, 0, 0).valueOf()) / (1000 * 60 * 60 * 24)
  );
};

export { hashStringToInt, getDayDiff as getDayOfYear };
