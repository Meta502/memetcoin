import { Block, genesisBlock } from "../schema/block";
import validateNewBlockIntegrity from "../utils/validator/validateBlockIntegrity";

const BLOCK_GENERATION_INTERVAL: number = 10;
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

export let blockchain: Block[] = [genesisBlock]

export function setBlockchain(newChain: Block[]) {
  blockchain = newChain
}

export function getLatestBlock() {
  return blockchain[blockchain.length - 1]
}

export function addBlockToChain(newBlock: Block) {
  if (validateNewBlockIntegrity(newBlock, getLatestBlock())) {
    blockchain.push(newBlock);
    return true;
  } else {
    return false;
  }
}

export function getDifficulty(chain: Block[]): number {
  const latestBlock: Block = chain[chain.length - 1];
  if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
    return getAdjustedDifficulty(latestBlock, chain);
  } else {
    return latestBlock.difficulty;
  }
}

export function getAdjustedDifficulty(latestBlock: Block, chain: Block[]) {
  const previousAdjustmentBlock = chain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
  const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
  const timeTaken: number = (latestBlock.timestamp - previousAdjustmentBlock.timestamp) / 1000;
  if (timeTaken < timeExpected / 2) {
    return previousAdjustmentBlock.difficulty + 1
  } else if (timeTaken > timeExpected * 2) {
    return previousAdjustmentBlock.difficulty - 1
  } else {
    return previousAdjustmentBlock.difficulty
  }
}
