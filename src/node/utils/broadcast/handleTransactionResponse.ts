import _ from "lodash";
import { addToTransactionPool, transactions } from "../../data/blockchain";
import { Transaction, TxInput } from "../../schema/transaction";
import broadcastTransactionPool from "./broadcastTransactionPool";

const getTxPoolIns = (aTransactionPool: Transaction[]): TxInput[] => {
  return _(aTransactionPool)
    .map((tx) => tx.txInputs)
    .flatten()
    .value();
};

const isValidTxForPool = (tx: Transaction, aTtransactionPool: Transaction[]): boolean => {
  const txPoolIns: TxInput[] = getTxPoolIns(transactions)

  const containsTxIn = (txIns: TxInput[], txIn: TxInput) => {
    return _.find(txPoolIns, ((txPoolIn) => {
      return txIn.txOutputIndex === txPoolIn.txOutputIndex && txIn.txOutputId === txPoolIn.txOutputId;
    }));
  };

  for (const txIn of tx.txInputs) {
    if (containsTxIn(txPoolIns, txIn)) {
      console.log('txIn already found in the txPool');
      return false;
    }
  }
  return true;
};

export default function handleTransactionResponse(message: any) {
  const receivedTransactions: Transaction[] = message.transactions
  let changed = false
  receivedTransactions.forEach((transaction: Transaction) => {
    try {
      if (!isValidTxForPool(transaction, transactions)) return
      addToTransactionPool(transaction)
      changed = true
    } catch (e) {
      console.log("[INFO] Could not validate transaction")
    }
  })

  if (changed) {
    broadcastTransactionPool()
    console.log("[INFO] Updated pending transaction pool")
  }
}
