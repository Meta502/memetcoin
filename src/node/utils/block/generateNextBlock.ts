import { Block } from "../../schema/block";
import { blockchain, getDifficulty, getLatestBlock, setUTXO, unspentTxOutputs } from "../../data/blockchain";
import findBlock from "./findBlock";
import { Transaction } from "../../schema/transaction";
import generateCoinbaseTx from "../transaction/generateCoinbaseTx";
import updateUnspentTxOutputs from "../transaction/updateUnspentTxOutputs";

export const generateNextBlock = (blockData: Transaction[], address: string) => {
  const previousBlock: Block = getLatestBlock();
  const nextIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = new Date().getTime();
  const difficulty = getDifficulty(blockchain)

  console.log(`[INFO] Generating a new block with difficulty ${difficulty}`)

  const transactions = [
    generateCoinbaseTx(address, nextIndex),
    ...blockData,
  ]

  const newBlock: Block = findBlock(
    nextIndex,
    previousBlock.hash,
    nextTimestamp,
    transactions,
    difficulty,
  );
  blockchain.push(newBlock);

  const updatedUTXO = updateUnspentTxOutputs(newBlock, unspentTxOutputs)
  setUTXO(updatedUTXO)

  return newBlock;
};

