import { COINBASE_AMOUNT } from "../../../constants";
import { Transaction, TxInput, TxOutput } from "../../schema/transaction";
import generateTransactionHash from "./generateTransactionHash";

export default function generateCoinbaseTx(address: string, blockIndex: number): Transaction {
  const transaction = new Transaction()
  const txInput = new TxInput("", blockIndex, "")

  transaction.txInputs = [txInput]
  transaction.txOutputs = [new TxOutput(address, COINBASE_AMOUNT)]
  transaction.id = generateTransactionHash(transaction)

  return transaction
}
