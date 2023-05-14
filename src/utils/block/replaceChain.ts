import { blockchain, setBlockchain } from "../../data/blockchain";
import { Block } from "../../schema/block";
import broadcastLatestBlock from "../broadcast/broadcastBlock";
import validateChain from "../validator/validateChain";
import getAccumulatedDifficulty from "./getAccumulatedDifficulty";

export default function replaceChain(newChain: Block[]) {
  if (
    validateChain(newChain)
    && getAccumulatedDifficulty(newChain) > getAccumulatedDifficulty(blockchain)
  ) {
    console.log("Longer blockchain found. Replacing current blockchain with received blockchain")
    setBlockchain(newChain)
    broadcastLatestBlock()
    // Broadcast here
  } else {
    console.log("Received invalid blockchain")
  }
}
