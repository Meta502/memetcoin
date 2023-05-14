import { Block, genesisBlock } from "../schema/block";
import validateNewBlockIntegrity from "../utils/validator/validateBlockIntegrity";

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

