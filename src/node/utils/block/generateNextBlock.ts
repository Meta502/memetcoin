import { Block } from "../../schema/block";
import { blockchain, getDifficulty, getLatestBlock } from "../../data/blockchain";
import findBlock from "./findBlock";
import { Transaction } from "../../schema/transaction";

export const generateNextBlock = (blockData: Transaction[]) => {
  const previousBlock: Block = getLatestBlock();
  const nextIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = new Date().getTime();
  const difficulty = getDifficulty(blockchain)

  console.log(`[INFO] Generating a new block with difficulty ${difficulty}`)

  const newBlock: Block = findBlock(
    nextIndex,
    previousBlock.hash,
    nextTimestamp,
    blockData,
    difficulty,
  );
  blockchain.push(newBlock);

  return newBlock;
};

