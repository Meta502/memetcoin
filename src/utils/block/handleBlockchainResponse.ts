import { addBlockToChain, getLatestBlock } from "../../data/blockchain";
import replaceChain from "./replaceChain";
import deserializeBlockchain from "./serializeBlockchain";

export default function handleBlockchainResponse(message: any) {
  const newChain = deserializeBlockchain(message.blocks)

  if (newChain.length === 0) {
    return console.log("Received empty blockchain response")
  }

  const latestBlockReceived = newChain[newChain.length - 1]
  const currentLatestBlock = getLatestBlock()

  // TODO: Refactor this nested if
  if (latestBlockReceived.index <= currentLatestBlock.index) {
    return console.log("[INFO] Received outdated blockchain. Ignoring...")
  }

  if (currentLatestBlock.hash === latestBlockReceived.previousHash) {
    if (addBlockToChain(latestBlockReceived)) {
      return console.log(`[INFO] Successfully committed new block with hash ${latestBlockReceived.hash}`)
    }
    return console.log("[WARN] Invalid block received. Ignoring...")
  }

  if (newChain.length === 1) {
    return console.log("[INFO] Orphaned block with greater index received. Querying chain from peers.")
    // Create Query Block function
  }

  console.log("[INFO] Received blockchain is longer than current blockchain")
  return replaceChain(newChain)
}
