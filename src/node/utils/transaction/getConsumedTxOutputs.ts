import { Block } from "../../schema/block";
import { UnspentTxOutput } from "../../schema/transaction";

export default function getConsumedTxOutputs(block: Block) {
  return block.data
    .map((transaction) => transaction.txInputs)
    .reduce((a, b) => a.concat(b), [])
    .map((txInput) => new UnspentTxOutput(txInput.txOutputId, txInput.txOutputIndex, "", 0))
}
