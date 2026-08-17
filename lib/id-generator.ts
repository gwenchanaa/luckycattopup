import { customAlphabet } from "nanoid";

// Excludes visually ambiguous characters (0/O, 1/I/L) so IDs are easy to
// read back and type in manually when copied from a screenshot.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generate = customAlphabet(ALPHABET, 12);

export function generateTransactionId(): string {
  return `TX-${generate()}`;
}

const TRANSACTION_ID_PATTERN = /^TX-[A-Z0-9]{12}$/;

export function isValidTransactionIdFormat(id: string): boolean {
  return TRANSACTION_ID_PATTERN.test(id.trim().toUpperCase());
}
