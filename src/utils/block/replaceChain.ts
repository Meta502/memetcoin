import { blockchain, setBlockchain } from "../../data/blockchain";
import { Block } from "../../schema/block";
import validateChain from "../validator/validateChain";

export default function replaceChain(newChain: Block[]) {
  if (validateChain(newChain) && newChain.length > blockchain.length) {
    console.log("Longer blockchain found. Replacing current blockchain with received blockchain")
    setBlockchain(newChain)
    // Broadcast here
  } else {
    console.log("Received invalid blockchain")
  }
}
