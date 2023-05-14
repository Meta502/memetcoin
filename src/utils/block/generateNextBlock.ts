import calculateBlockHash from "./calculateBlockHash";
import { Block } from "../../schema/block";
import { blockchain, getLatestBlock } from "../../data/blockchain";

export const generateNextBlock = (blockData: string) => {
  const previousBlock: Block = getLatestBlock();
  const nextIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = new Date().getTime();
  const nextHash: string = calculateBlockHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
  const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);

  blockchain.push(newBlock);

  return newBlock;
};

