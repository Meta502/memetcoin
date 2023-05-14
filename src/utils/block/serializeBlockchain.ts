import { Block } from "../../schema/block"
import validateBlockStructure from "../validator/validateBlockStructure"

export default function deserializeBlockchain(chain: any[]) {
  return chain.map((item) => {
    if (!validateBlockStructure(item)) {
      throw SyntaxError()
    }

    return new Block(
      item.index,
      item.hash,
      item.previousHash,
      item.timestamp,
      item.data,
    )
  })
}
