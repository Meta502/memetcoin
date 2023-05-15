import { Transaction } from "../../schema/transaction";
import generateTransactionHash from "../transaction/generateTransactionHash";

export default function validateTransactionStructure(transaction: Transaction) {
  if (generateTransactionHash(transaction) !== transaction.id) {
    return false
  }
  return true
}

