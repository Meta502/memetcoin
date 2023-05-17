import express, { Request, Response } from "express"
import fs from "fs"

import { addToTransactionPool, blockchain, getBalance, getDifficulty, transactions, unspentTxOutputs } from "../data/blockchain"
import { generateNextBlock } from "./block/generateNextBlock"
import broadcastLatestBlock from "./broadcast/broadcastBlock"
import createTransaction from "./transaction/createTransaction"
import { Transaction, UnspentTxOutput } from "../schema/transaction"
import broadcastTransactionPool from "./broadcast/broadcastTransactionPool"

const initHttpServer = (port: number, { privateKey, publicKey, address }) => {
  const app = express()

  app.use(express.json())
  app.set("view engine", "ejs")

  app.get("/", (_: Request, res: Response) => {
    const log = fs.readFileSync(process.cwd() + `/logs/node-${port}.log`)

    res.render("pages/index", {
      log,
      address,
      privateKey: privateKey.toString("base64"),
      publicKey: publicKey.toString("base64"),
      blockLength: blockchain.length,
      difficulty: getDifficulty(blockchain),
    })
  })

  app.get("/wallet", (_: Request, res: Response) => {
    res.render("pages/wallet", {
      address,
      balance: getBalance(address, unspentTxOutputs),
      unspentTxOutputs: unspentTxOutputs
        .filter((unspentTxOutput: UnspentTxOutput) => unspentTxOutput.address === address)
    })
  })

  app.get("/wallet/create-transaction", (_: Request, res: Response) => {
    res.render("pages/createTransaction", {
      address,
      balance: getBalance(address, unspentTxOutputs),
    })
  })

  app.post("/transactions", (req: Request, res: Response) => {
    const transaction = createTransaction(
      address,
      req.body.target_address,
      Number(req.body.amount),
    )

    addToTransactionPool(transaction)
    broadcastTransactionPool()

    res.status(201).json()
  })

  app.get("/blocks", (_: Request, res: Response) => {
    return res.render("pages/blocks", {
      blockchain
    })
  })

  app.post("/blocks", (req: Request, res: Response) => {
    const newBlock = generateNextBlock(transactions, address);
    broadcastLatestBlock();
    return res.status(201).json(newBlock);
  })

  app.get("/transactions", (_: Request, res: Response) => {
    res.render("pages/transactions")
  })

  app.listen(port, () => {
    console.log(`[INFO] Server listening to HTTP requests on port ${port}`)
  })

  return app
}

export default initHttpServer

