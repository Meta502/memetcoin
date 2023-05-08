import express, { Request, Response } from "express"
import fs from "fs"

const initHttpServer = (port: number, { privateKey, publicKey, address }) => {
  const app = express()

  app.set("view engine", "ejs")

  app.get("/", (_: Request, res: Response) => {
    const log = fs.readFileSync(process.cwd() + `/logs/node-${port}.log`)

    res.render("pages/index", {
      log,
      address,
      privateKey: privateKey.toString("base64"),
      publicKey: publicKey.toString("base64"),
    })
  })

  app.get("/blocks", (_: Request, res: Response) => {
    res.render("pages/blocks")
  })

  app.listen(port, () => {
    console.log(`[INFO] Server listening to HTTP requests on port ${port}`)
  })

  return app
}

export default initHttpServer

