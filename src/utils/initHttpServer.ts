import express, { Request, Response } from "express"

const initHttpServer = (port: number) => {
  const app = express()

  app.set("view engine", "ejs")

  app.get("/", (_: Request, res: Response) => {
    res.render("pages/index")
  })

  app.listen(port, () => {
    console.log(`[INFO] Server listening to HTTP requests on port ${port}`)
  })

  return app
}

export default initHttpServer

