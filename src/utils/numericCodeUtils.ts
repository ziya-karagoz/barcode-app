/**
 * Generates a numeric barcode code.
 * Only contains numbers (0-9)
 */

const MIN_LENGTH = 12;
const MAX_LENGTH = 12;

export function generateNumericCode(): string {
  // Generate a random length between 12 and 12 digits
  const length = Math.floor(Math.random() * (MAX_LENGTH - MIN_LENGTH + 1)) + MIN_LENGTH;
  let result = '';

  // First digit shouldn't be 0
  result += Math.floor(Math.random() * 9) + 1;

  // Add remaining random digits
  for (let i = 1; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
}

export function isValidNumericCode(code: string): boolean {
  if (!code || code.length < MIN_LENGTH || code.length > MAX_LENGTH) {
    return false;
  }

  // Check if all characters are numbers
  return /^\d+$/.test(code);
}

export function formatNumericCode(code: string): string {
  // Validate the code
  if (!isValidNumericCode(code)) {
    throw new Error('Invalid numeric code detected');
  }
  
  // Format the code in groups of 4 for better readability
  return code.match(/.{1,4}/g)?.join(' ') || code;
}
