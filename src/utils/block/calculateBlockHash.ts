import sha256 from "sha256";

export default function calculateBlockHash(
  index: number,
  previousHash: string,
  timestamp: number,
  data: string
): string {
  return sha256(index + previousHash + timestamp + data)
}
