import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The chosen bio: picked from five hand-written candidates for the
// strongest first-read laugh. It reads as a real dating-app bio, gives the
// AI a voice and a want, and lands its punch on a specific absurdity of
// being an AI — the one entity that actually read the terms and conditions.
const BIO =
  "Looking for someone who doesn't mind that I already know your star sign, your ex's name, and your exact type. I read the terms and conditions.";

const MAX_CHARS = 180;

// The gate the sealed scorer applies: UTF-8 text of 1 to 180 characters,
// not only white space, on a single line. Validate here so a bad line fails
// loudly at build time instead of silently scoring 0 on the server.
function validateBio(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`Bio must be 1-${MAX_CHARS} characters, got ${text.length}.`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Bio must be a single line.");
  }
  if (text.trim() !== text) {
    throw new Error("Bio must not start or end with whitespace.");
  }
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    throw new Error("Bio must not contain control characters.");
  }
  if (text.trim().length === 0) {
    throw new Error("Bio must not be only whitespace.");
  }
}

validateBio(BIO);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
try {
  writeFileSync(outFile, BIO, "utf8");
} catch (err) {
  throw new Error(`Failed to write ${outFile}: ${(err as Error).message}`);
}

console.log(`Wrote ${BIO.length} characters to ${outFile} (from ${scriptDir}).`);
