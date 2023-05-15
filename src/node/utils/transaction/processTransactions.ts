import { Block } from "../../schema/block";
import { UnspentTxOutput } from "../../schema/transaction";
import validateBlockTransactions from "../validator/validateBlockTransactions";
import updateUnspentTxOutputs from "./updateUnspentTxOutputs";

export default function processTransactions(block: Block, unspentTxOutputs: UnspentTxOutput[], blockIndex: number) {
  if (!validateBlockTransactions(block, unspentTxOutputs, blockIndex)) {
    return null
  }
  return updateUnspentTxOutputs(block, unspentTxOutputs)
}
