import { Block } from "../../schema/block";
import { TxInput, UnspentTxOutput } from "../../schema/transaction";
import validateCoinbaseTx from "./validateCoinbaseTx";
import _ from "lodash"
import validateTransaction from "./validateTransaction";

function hasDuplicateTxInput(txInputs: TxInput[]): boolean {
  const groups = _.countBy(txInputs, (txIn: TxInput) => txIn.txOutputId + txIn.txOutputIndex);
  return _(groups)
    .map((value, key) => {
      if (value > 1) {
        console.log('duplicate txIn: ' + key);
        return true;
      } else {
        return false;
      }
    })
    .includes(true);
}

export default function validateBlockTransactions(block: Block, unspentTxOutputs: UnspentTxOutput[], blockIndex: number): boolean {
  const coinbaseTx = block.data[0]
  if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
    return false
  }

  const txInputs = _(block.data)
    .map((transaction) => transaction.txInputs)
    .flatten()
    .value()

  if (hasDuplicateTxInput(txInputs)) {
    return false
  }

  const normalTransactions = block.data.slice(1)
  return normalTransactions.every((transaction) => validateTransaction(transaction, unspentTxOutputs))
}
