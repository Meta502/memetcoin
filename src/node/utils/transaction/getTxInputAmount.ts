import { TxInput, UnspentTxOutput } from "../../schema/transaction";
import findUnspentTxOutputs from "./findUnspentTxOutputs";

export default function getTxInputAmount(txInput: TxInput, unspentTxOutputs: UnspentTxOutput[]) {
  const unspentTxOutput = findUnspentTxOutputs(txInput.txOutputId, txInput.txOutputIndex, unspentTxOutputs)
  if (!unspentTxOutput) {
    console.log("[WARN] Invalid TxInput: No associated UTXO found")
    throw Error()
  }
  return unspentTxOutput.amount
}
