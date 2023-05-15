import hashToBinary from "../hexToBinary";

export default function validateHashDifficulty(hash: string, difficulty: number): boolean {
  const hashInBinary: string = hashToBinary(hash);
  const requiredPrefix: string = "0".repeat(difficulty);
  return hashInBinary.startsWith(requiredPrefix);
}
