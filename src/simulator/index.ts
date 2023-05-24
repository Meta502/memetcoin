import minimist from "minimist"
import { ChildProcess, spawn } from "node:child_process"
import path from "path"

import { Flag } from "../constants"
import { Server } from "socket.io"
import http from "http"
import dgram from "node:dgram"

const argv = minimist(process.argv.slice(2))
const nodePath = path.resolve(__dirname, '../node/index.js')
const port = argv["basePort"] || Math.floor(Math.random() * 65535)

async function main() {
  // Randomly generate basePort between 1 to 65535
  const basePort = port + 1
  const ports = new Array()

  // Initiate array for storing process handles
  const processes: ChildProcess[] = []

  const numNodes = argv[Flag.NODES]
  for (let i = 0; i < numNodes; i++) {
    ports.push(basePort + i);
  }

  const numHonest = Math.floor(numNodes * (1 - argv[Flag.MALICIOUS]))
  const numMalicious = Math.floor(numNodes * argv[Flag.MALICIOUS])

  for (let i = 0; i < numHonest; i++) {
    const numSpawnedProcess = processes.length
    const node = spawn("node", [nodePath, `-p=${basePort + numSpawnedProcess}`, `--nodePorts=${ports.join(",")}`, `--basePort=${port}`])

    node.stdout.on("data", (data) => {
      console.log(`[INFO] [Node-${basePort + numSpawnedProcess}]: ${data}`)
    })

    node.stderr.on("data", (data) => {
      console.error(`[ERROR] [Node-${basePort + numSpawnedProcess}]: ${data}`)
    })

    node.on("close", (code) => {
      console.log(`node on port ${basePort + numSpawnedProcess} crashed with code ${code}`)
    })

    processes.push(node)
  }

  for (let i = 0; i < numMalicious; i++) {
    const numSpawnedProcess = processes.length
    const node = spawn("node", [nodePath, `-p ${basePort + numSpawnedProcess}`, `--nodePorts ${ports.join(",")}`, `--basePort=${port}`])

    node.stdout.on("data", (data) => {
      console.log(`[INFO] [Node-${basePort + numSpawnedProcess}]: ${data}`)
    })

    node.stderr.on("data", (data) => {
      console.error(`[ERROR] [Node-${basePort + numSpawnedProcess}]: ${data}`)
    })

    node.on("close", (code) => {
      console.log(`node on port ${basePort + numSpawnedProcess} crashed with code ${code}`)
    })

    processes.push(node)
  }
}

const httpServer = http.createServer()
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

io.of("/main").on("connection", (socket) => {
  const ports: Number[] = []
  const numNodes = argv[Flag.NODES]
  for (let i = 0; i < numNodes; i++) {
    ports.push(port + i + 1);
  }

  socket.join("main")
  socket.emit("connAck", ports)
})

httpServer.listen(4555, () => {
  console.log("WS server listening on *:4555")
})

const udpSocket = dgram.createSocket("udp4")
udpSocket.on("listening", () => {
  const { address, port } = udpSocket.address()
  console.log(`[INFO] [Simulator Server] (${address}, ${port}): Start simulator server UDP socket`)
})

udpSocket.on("message", (msg, rinfo) => {
  try {
    const message = JSON.parse(
      msg.toString("utf8")
    );

    if (message.type === "notify") {
      return io.of("/main").emit("notify", {
        node: rinfo.port,
        message: {
          ...message.message
        },
      })
    }
  } catch (e) {
    throw e
  }
})

udpSocket.bind(
  port
)

main();
