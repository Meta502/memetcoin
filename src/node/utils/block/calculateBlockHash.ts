import sha256 from "sha256";
import { Transaction } from "../../schema/transaction";

export default function calculateBlockHash(
  index: number,
  previousHash: string,
  timestamp: number,
  data: Transaction[],
  difficulty: number,
  nonce: number,
): string {
  return sha256(index + previousHash + timestamp + data + difficulty + nonce)
}
