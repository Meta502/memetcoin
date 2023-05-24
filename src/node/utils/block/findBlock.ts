import { Block } from "../../schema/block";
import { Transaction } from "../../schema/transaction";
import validateHashDifficulty from "../validator/validateHashDifficulty";
import calculateBlockHash from "./calculateBlockHash";

export default function findBlock(index: number, previousHash: string, timestamp: number, data: Transaction[], difficulty: number): Block {
  let nonce = 0;
  let start = Date.now()

  while (true) {
    const hash: string = calculateBlockHash(index, previousHash, timestamp, data, difficulty, nonce);
    if (nonce % 500 === 0) {
      console.log("[INFO] Number of hashes generated in current Proof-of-Work generation: " + nonce)
    }
    if (validateHashDifficulty(hash, difficulty)) {
      console.log(`[INFO] Valid hash ${hash} found for difficulty ${difficulty} with nonce ${nonce}. Creating new block...`)
      console.log(`[INFO] Hash generation took ${(Date.now() - start) / 1000} seconds`)
      return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce)
    }
    nonce++;
  }
}
