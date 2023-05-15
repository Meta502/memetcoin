import { Transaction, TxInput, UnspentTxOutput } from "../../schema/transaction";
import ecdsa from "elliptic"

const ec = new ecdsa.ec("secp256k1")

export default function validateTransactionInput(transactionInput: TxInput, transaction: Transaction, unspentTxOutputs: UnspentTxOutput[]) {
  const referencedUnspentTransactionOutput: UnspentTxOutput | undefined =
    unspentTxOutputs.find((unspentTxOutput) => unspentTxOutput.txOutputId === transactionInput.txOutputId && unspentTxOutput.txOutputIndex === transactionInput.txOutputIndex)

  if (!referencedUnspentTransactionOutput) {
    return false
  }

  const address = referencedUnspentTransactionOutput.address

  const key = ec.keyFromPublic(address, "hex")
  return key.verify(transaction.id, transactionInput.signature)
}
