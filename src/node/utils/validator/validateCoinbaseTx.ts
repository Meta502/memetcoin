import { COINBASE_AMOUNT } from "../../../constants";
import { Transaction } from "../../schema/transaction";
import generateTransactionHash from "../transaction/generateTransactionHash";

export default function validateCoinbaseTx(transaction: Transaction, blockIndex: number): boolean {
  if (generateTransactionHash(transaction) !== transaction.id) {
    return false
  }
  if (transaction.txInputs.length !== 1) {
    return false
  }
  if (transaction.txInputs[0].txOutputIndex !== blockIndex) {
    return false
  }
  if (transaction.txOutputs.length !== 1) {
    return false
  }
  if (transaction.txOutputs[0].amount != COINBASE_AMOUNT) {
    return false
  }

  return true
}
