import { Block } from "../../schema/block";
import { blockchain, getDifficulty, getLatestBlock } from "../../data/blockchain";
import findBlock from "./findBlock";

export const generateNextBlock = (blockData: string) => {
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

