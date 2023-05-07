import http, { IncomingMessage, ServerResponse } from "http"

const initHttpServer = (port: number) => {
  const requestListener = function(_req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200);
    res.end(`Hello, World! This is the blockchain node on port ${port}`)
  }

  const httpServer = http.createServer(requestListener)
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server is running on http://0.0.0.0:${port} (Local: http://127.0.0.1:${port})`)
  })
}

export default initHttpServer

