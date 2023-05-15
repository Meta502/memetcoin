import { UnspentTxOutput } from "../../schema/transaction";

export default function findUnspentTxOutputs(transactionId: string, index: number, aUnspentTxOuts: UnspentTxOutput[]): UnspentTxOutput | undefined {
  return aUnspentTxOuts.find((unspentTransactionOutput) => unspentTransactionOutput.txOutputId === transactionId && unspentTransactionOutput.txOutputIndex === index)
};
