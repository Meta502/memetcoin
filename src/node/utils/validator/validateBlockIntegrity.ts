import { unspentTxOutputs } from "../../data/blockchain";
import { Block } from "../../schema/block";
import calculateBlockHash from "../block/calculateBlockHash";
import validateBlockTransactions from "./validateBlockTransactions";

export default function validateNewBlockIntegrity(newBlock: Block, previousBlock: Block) {
  if (previousBlock.index + 1 !== newBlock.index) {
    console.log("invalid index");
    return false;
  }

  if (previousBlock.hash !== newBlock.previousHash) {
    console.log("invalid previousHash")
    return false;
  }

  if (
    calculateBlockHash(
      newBlock.index,
      newBlock.previousHash,
      newBlock.timestamp,
      newBlock.data,
      newBlock.difficulty,
      newBlock.nonce,
    ) !== newBlock.hash
  ) {
    console.log("invalid hash: ")
    return false;
  }

  if (
    !validateBlockTransactions(newBlock, unspentTxOutputs, newBlock.index)
  ) {
    console.log("invalid block transactions")
    return false;
  }

  return true;
}
