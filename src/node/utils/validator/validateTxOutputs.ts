import { unspentTxOutputs } from "../../data/blockchain";
import { Transaction } from "../../schema/transaction";
import getTxInputAmount from "../transaction/getTxInputAmount";

export default function validateTxOutputs(transaction: Transaction) {
  const totalTxInputValues: number = transaction.txInputs
    .map((txInput) => getTxInputAmount(txInput, unspentTxOutputs))
    .reduce((a, b) => (a + b), 0)

  const totalTxOutputValues: number = transaction.txOutputs
    .map((txOutput) => txOutput.amount)
    .reduce((a, b) => (a + b), 0)

  return totalTxOutputValues === totalTxInputValues
}
