import { Transaction, TxInput, UnspentTxOutput } from "../../schema/transaction";
import ecdsa from "elliptic"
import findUnspentTxOutputs from "./findUnspentTxOutputs";

const ec = new ecdsa.ec("secp256k1")

export default function signTransactionInput(
  transaction: Transaction,
  txInputIndex: number,
  privateKey: string,
  unspentTxOutputs: UnspentTxOutput[]
): string {
  const txInput: TxInput = transaction.txInputs[txInputIndex]
  const payload = transaction.id
  const referencedUnspentTxOutput: UnspentTxOutput | undefined = findUnspentTxOutputs(
    txInput.txOutputId,
    txInput.txOutputIndex,
    unspentTxOutputs,
  )

  if (!referencedUnspentTxOutput) {
    console.log("[INFO] Invalid UTXO found. Rejecting transaction.")
    throw Error()
  }

  const referencedAddress = referencedUnspentTxOutput.address

  const key = ec.keyFromPrivate(privateKey)
  const signature: string = Buffer.from(
    key.sign(payload).toDER()
  ).toString("hex")

  return signature
}
