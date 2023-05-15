import { Transaction, UnspentTxOutput } from "../../schema/transaction";
import generateTransactionHash from "../transaction/generateTransactionHash";
import validateTransactionInput from "./validateTransactionInput";
import validateTxOutputs from "./validateTxOutputs";

export default function validateTransaction(transaction: Transaction, unspentTxOutputs: UnspentTxOutput[]): boolean {
  if (generateTransactionHash(transaction) !== transaction.id) {
    return false
  }

  const validTxInputs = transaction.txInputs.every((txInput) => validateTransactionInput(txInput, transaction, unspentTxOutputs))
  if (!validTxInputs) {
    return false
  }

  const validTxOutputs = validateTxOutputs(transaction)
  if (!validTxOutputs) {
    return false
  }

  return true
}
