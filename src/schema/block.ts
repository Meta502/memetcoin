export class Block {
  public index: number;
  public hash: string;
  public previousHash: string | null;
  public timestamp: number;
  public data: string;

  constructor(index: number, hash: string, previousHash: string | null, timestamp: number, data: string) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
  }
}

export const genesisBlock: Block = new Block(
  0,
  "f8891411d688af29d70616451cdf7d464f662b68101f1d779f189928e7af0056",
  null,
  1684071643352,
  "genesis block",
)
