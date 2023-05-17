import _ from "lodash";
import { Block, genesisBlock } from "../schema/block";
import { Transaction, TxInput, TxOutput, UnspentTxOutput } from "../schema/transaction";
import validateNewBlockIntegrity from "../utils/validator/validateBlockIntegrity";
import validateTransaction from "../utils/validator/validateTransaction";

const BLOCK_GENERATION_INTERVAL: number = 1;
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

export let blockchain: Block[] = [genesisBlock]
export let unspentTxOutputs: UnspentTxOutput[] = []
export let transactions: Transaction[] = []

export function setUTXO(data: UnspentTxOutput[]) {
  unspentTxOutputs = data
}

export function setBlockchain(newChain: Block[]) {
  blockchain = newChain
}

export function getLatestBlock() {
  return blockchain[blockchain.length - 1]
}

export function addBlockToChain(newBlock: Block) {
  if (validateNewBlockIntegrity(newBlock, getLatestBlock())) {
    blockchain.push(newBlock);
    return true;
  } else {
    return false;
  }
}

export function addToTransactionPool(transaction: Transaction) {
  if (!validateTransaction(transaction, unspentTxOutputs)) {
    console.log("[ERROR] Invalid transaction")
    throw Error()
  }
  transactions.push(transaction)
}

export function hasTxIn(txIn: TxInput): boolean {
  const foundTxIn = unspentTxOutputs.find((uTxO: UnspentTxOutput) => {
    return uTxO.txOutputId === txIn.txOutputId && uTxO.txOutputIndex === txIn.txOutputIndex;
  });
  return foundTxIn !== undefined;
}

export function updateTransactionPool() {
  const invalidTxs: Transaction[] = [];
  for (const tx of transactions) {
    for (const txIn of tx.txInputs) {
      if (!hasTxIn(txIn)) {
        invalidTxs.push(tx);
        break;
      }
    }
  }
  if (invalidTxs.length > 0) {
    console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
    transactions = _.without(transactions, ...invalidTxs);
  }
}

export function getDifficulty(chain: Block[]): number {
  const latestBlock: Block = chain[chain.length - 1];
  if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
    return getAdjustedDifficulty(latestBlock, chain);
  } else {
    return latestBlock.difficulty;
  }
}

export function getAdjustedDifficulty(latestBlock: Block, chain: Block[]) {
  const previousAdjustmentBlock = chain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
  const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
  const timeTaken: number = (latestBlock.timestamp - previousAdjustmentBlock.timestamp) / 1000;
  if (timeTaken < timeExpected / 2) {
    return previousAdjustmentBlock.difficulty + 1
  } else if (timeTaken > timeExpected * 2) {
    return previousAdjustmentBlock.difficulty - 1
  } else {
    return previousAdjustmentBlock.difficulty
  }
}

export function getBalance(address: string, unspentTxOutputs: UnspentTxOutput[]): number {
  return _(unspentTxOutputs)
    .filter((unspentTxOutput: UnspentTxOutput) => unspentTxOutput.address === address)
    .map((unspentTxOutput: UnspentTxOutput) => unspentTxOutput.amount)
    .sum()
}

