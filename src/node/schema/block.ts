import { Transaction } from "./transaction";

import minimist from "minimist";

const argv = minimist(process.argv.slice(2))

export class Block {
  public index: number;
  public hash: string;
  public previousHash: string | null;
  public timestamp: number;
  public data: Transaction[];

  public difficulty: number;
  public nonce: number;

  constructor(index: number, hash: string, previousHash: string | null, timestamp: number, data: Transaction[], difficulty: number, nonce: number) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}

export const genesisBlock: Block = new Block(
  0,
  "3d2bed1ab0bc3e670df22459acd039eaf7092ad09ea04cea556e84cc780ccba9",
  null,
  1684071643352,
  [],
  argv["initialDifficulty"] || 16,
  1,
)
