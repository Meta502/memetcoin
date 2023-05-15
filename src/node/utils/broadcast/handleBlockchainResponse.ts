import { addBlockToChain, getLatestBlock, setUTXO, unspentTxOutputs } from "../../data/blockchain";
import replaceChain from "../block/replaceChain";
import deserializeBlockchain from "../block/deserializeBlockchain";
import broadcast from "./broadcast";
import { MessageType } from "../../schema/broadcast";
import updateUnspentTxOutputs from "../transaction/updateUnspentTxOutputs";

export default function handleBlockchainResponse(message: any) {
  const newChain = deserializeBlockchain(message.blocks)

  if (newChain.length === 0) {
    return console.log("Received empty blockchain response")
  }

  const latestBlockReceived = newChain[newChain.length - 1]
  const currentLatestBlock = getLatestBlock()

  if (latestBlockReceived.index <= currentLatestBlock.index) {
    return console.log("[INFO] Received outdated blockchain. Ignoring...")
  }

  if (currentLatestBlock.hash === latestBlockReceived.previousHash) {
    if (addBlockToChain(latestBlockReceived)) {
      const updatedUTXO = updateUnspentTxOutputs(latestBlockReceived, unspentTxOutputs)
      setUTXO(updatedUTXO)
      return console.log(`[INFO] Successfully committed new block with hash ${latestBlockReceived.hash}`)
    }
    return console.log("[WARN] Invalid block received. Ignoring...")
  }

  if (newChain.length === 1) {
    console.log("[INFO] Orphaned block with greater index received. Querying chain from peers.")

    return broadcast(JSON.stringify({
      type: MessageType.QUERY_ALL,
    }))
  }

  console.log("[INFO] Received blockchain is longer than current blockchain")
  return replaceChain(newChain)
}
