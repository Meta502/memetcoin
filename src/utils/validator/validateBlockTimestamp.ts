import { Block } from "../../schema/block";

export default function validateBlockTimestamp(newBlock: Block, previousBlock: Block): boolean {
  return (
    (previousBlock.timestamp / 1000) - 60 < newBlock.timestamp
    && (newBlock.timestamp / 1000) - 60 < (Date.now() / 100)
  )
}
