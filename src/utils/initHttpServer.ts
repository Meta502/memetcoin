import express, { Request, Response } from "express"
import fs from "fs"

import { blockchain } from "../data/blockchain"
import { generateNextBlock } from "./block/generateNextBlock"
import broadcastLatestBlock from "./broadcast/broadcastBlock"

const initHttpServer = (port: number, { privateKey, publicKey, address, neighborPorts }) => {
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
    })
  })

  app.post("/blocks", (req: Request, res: Response) => {
    const newBlock = generateNextBlock(req.body.data);
    broadcastLatestBlock(neighborPorts);
    return res.status(201).json(newBlock);
  })

  app.get("/blocks", (_: Request, res: Response) => {
    return res.render("pages/blocks", {
      blockchain
    })
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

