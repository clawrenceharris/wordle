import fs from "fs";
import path from "path";

const WORD_FILE = path.join(process.cwd(), "src", "utils", "wordle-bank.txt");

const content = fs.readFileSync(WORD_FILE, "utf8");

// Split into lines and filter empty lines
const words = content
  .split(/\r?\n/)
  .map((w) => w.trim())
  .filter((w) => w.length > 0);

const originalCount = words.length;

// Remove duplicates using Set
const uniqueWords = [...new Set(words)];
const uniqueCount = uniqueWords.length;

const removed = originalCount - uniqueCount;

// Write back to file
fs.writeFileSync(WORD_FILE, uniqueWords.sort().join("\n") + "\n", "utf8");

// Report results
console.log(`✓ Word bank updated`);
console.log(`  Original words: ${originalCount}`);
console.log(`  Unique words: ${uniqueCount}`);
console.log(`  Duplicates removed: ${removed}`);
console.log(`  New word count: ${originalCount - removed}`);
