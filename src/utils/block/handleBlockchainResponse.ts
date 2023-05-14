import { addBlockToChain, getLatestBlock } from "../../data/blockchain";
import replaceChain from "./replaceChain";
import deserializeBlockchain from "./serializeBlockchain";

export default function handleBlockchainResponse(message: any) {
  const newChain = deserializeBlockchain(message.blocks)

  if (newChain.length === 0) {
    console.warn("Received empty blockchain response")
  }

  const latestBlockReceived = newChain[newChain.length - 1]
  const currentLatestBlock = getLatestBlock()

  // TODO: Refactor this nested if
  if (latestBlockReceived.index > currentLatestBlock.index) {
    if (currentLatestBlock.hash === latestBlockReceived.previousHash) {
      if (addBlockToChain(latestBlockReceived)) {
        console.log(`Successfully committed new block with hash ${latestBlockReceived.hash}`)
      } else if (newChain.length === 1) {
        console.log("Query chain from peers")
      } else {
        console.log("Received blockchain is longer than current blockchain")
        replaceChain(newChain)
      }
    }
  } else {
    console.log("Received outdated blockchain. Ignoring...")
  }
}
