import { Block } from "../../schema/block";
import { UnspentTxOutput } from "../../schema/transaction";

export default function getUnspentTxOutputs(block: Block) {
  return block.data.map((transaction) => (
    transaction.txOutputs
      .map((txOutput, index) => new UnspentTxOutput(
        transaction.id,
        index,
        txOutput.address,
        txOutput.amount,
      ))
  )
  )
    .reduce((a, b) => a.concat(b), [])
}
