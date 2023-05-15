import sha256 from "sha256";
import { Transaction, TxInput, TxOutput } from "../../schema/transaction";

export default function generateTransactionHash(transaction: Transaction) {
  const txInputData: string = transaction.txInputs
    .map((txInput: TxInput) => txInput.txOutputId + txInput.txOutputIndex)
    .reduce((a, b) => a + b, "")

  const txOutputData: string = transaction.txOutputs
    .map((txOutput: TxOutput) => txOutput.address + txOutput.amount)
    .reduce((a, b) => a + b, "")

  return sha256(txInputData + txOutputData)
}
