import { unspentTxOutputs } from "../../data/blockchain";
import { Block } from "../../schema/block";
import { UnspentTxOutput } from "../../schema/transaction";
import findUnspentTxOutputs from "./findUnspentTxOutputs";
import getConsumedTxOutputs from "./getConsumedTxOutputs";
import getUnspentTxOutputs from "./getUnspentTxOutputs";

export default function updateUnspentTxOutputs(block: Block, unspentTxOuts: UnspentTxOutput[]): UnspentTxOutput[] {
  const newUnspentTxOutputs = getUnspentTxOutputs(block)
  const consumedTxOutputs = getConsumedTxOutputs(block)

  return unspentTxOutputs
    .filter((unspentTxOutput) => (
      !findUnspentTxOutputs(unspentTxOutput.txOutputId, unspentTxOutput.txOutputIndex, consumedTxOutputs)
    ))
    .concat(newUnspentTxOutputs)
}
