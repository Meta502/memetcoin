import _ from "lodash";
import { Transaction, TxInput, TxOutput, UnspentTxOutput } from "../../schema/transaction";
import { unspentTxOutputs } from "../../data/blockchain";
import generateTransactionHash from "./generateTransactionHash";
import signTransactionInput from "./signTransactionInput";
import { privateKey } from "../..";

export function findTxOutputsForAmount(amount: number, myUnspentTxOutputs: UnspentTxOutput[]) {
  let currentAmount = 0
  const includedUnspentTxOutputs: UnspentTxOutput[] = []

  for (const unspentTxOutput of myUnspentTxOutputs) {
    includedUnspentTxOutputs.push(unspentTxOutput)
    currentAmount = currentAmount += unspentTxOutput.amount
    if (currentAmount >= amount) {
      const leftOverAmount = currentAmount - amount
      return { includedUnspentTxOutputs, leftOverAmount }
    }
  }
  throw Error("you poor")
}

export function convertToUnsignedTxInput({ txOutputId, txOutputIndex }: UnspentTxOutput) {
  const txInput: TxInput = new TxInput(txOutputId, txOutputIndex, "")
  return txInput
}

export function createTxOutputs(sourceAddress: string, receiverAddress: string, amount: number, leftOverAmount: number) {
  const txOutput: TxOutput = new TxOutput(receiverAddress, amount)
  if (leftOverAmount === 0) {
    return [txOutput]
  }

  const leftOverTxOutput = new TxOutput(sourceAddress, leftOverAmount)
  return [txOutput, leftOverTxOutput]
}

export default function createTransaction(sourceAddress: string, receiverAddress: string, amount: number) {
  const { includedUnspentTxOutputs, leftOverAmount } = findTxOutputsForAmount(
    amount,
    unspentTxOutputs.filter((unspentTxOutput: UnspentTxOutput) => unspentTxOutput.address === sourceAddress)
  )
  const unsignedTxInputs = includedUnspentTxOutputs.map(convertToUnsignedTxInput)
  const txOutputs = createTxOutputs(sourceAddress, receiverAddress, amount, leftOverAmount)

  const transaction = new Transaction()
  transaction.txInputs = unsignedTxInputs
  transaction.txOutputs = txOutputs
  transaction.id = generateTransactionHash(transaction)

  transaction.txInputs = transaction.txInputs.map((txInput: TxInput, index: number) => {
    txInput.signature = signTransactionInput(transaction, index, privateKey, unspentTxOutputs)
    return txInput
  })

  return transaction
}
