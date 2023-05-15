import { Block } from "../../schema/block";
import calculateBlockHash from "../block/calculateBlockHash";

export default function validateNewBlockIntegrity(newBlock: Block, previousBlock: Block) {
  if (previousBlock.index + 1 !== newBlock.index) {
    console.log("invalid index");
    return false;
  } else if (previousBlock.hash !== newBlock.previousHash) {
    console.log("invalid previousHash")
    return false;
  } else if (
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

  return true;
}
