import { Block } from "../../schema/block";
import validateHashDifficulty from "../validator/validateHashDifficulty";
import calculateBlockHash from "./calculateBlockHash";

export default function findBlock(index: number, previousHash: string, timestamp: number, data: string, difficulty: number): Block {
  let nonce = 0;
  while (true) {
    const hash: string = calculateBlockHash(index, previousHash, timestamp, data, difficulty, nonce);
    if (validateHashDifficulty(hash, difficulty)) {
      return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce)
    }
    nonce++;
  }
}
