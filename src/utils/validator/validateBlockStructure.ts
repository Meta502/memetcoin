import { Block } from "../../schema/block";

export default function validateBlockStructure(block: Block) {
  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string"
  )
}
