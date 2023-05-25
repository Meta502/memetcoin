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

let processes: ChildProcess[] = []
let ports: number[] = []

async function startProcess(numNodes: number, port: number, ports: number[]) {
  for (let i = 0; i < numNodes; i++) {
    const numSpawnedProcess = processes.length
    const node = spawn("node", [nodePath, `-p=${port + numSpawnedProcess}`, `--nodePorts=${ports.join(",")}`, `--basePort=${port}`])

    node.stdout.on("data", (data) => {
      console.log(`[INFO] [Node-${port + numSpawnedProcess}]: ${data}`)
    })

    node.stderr.on("data", (data) => {
      console.error(`[ERROR] [Node-${port + numSpawnedProcess}]: ${data}`)
    })

    node.on("close", (code) => {
      console.log(`node on port ${port + numSpawnedProcess} crashed with code ${code}`)
    })

    processes.push(node)
  }

  return true
}

const httpServer = http.createServer()
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

io.of("/main").on("connection", (socket) => {
  const numNodes = argv[Flag.NODES]

  socket.join("main")
  socket.emit("connAck", ports)

  socket.on("start-simulator", (numNodes) => {
    if (processes.length > 0) return false

    ports = []
    for (let i = 0; i < numNodes; i++) {
      ports.push(port + 1 + i);
    }
    const start = startProcess(numNodes, port + 1, ports)
    if (!start) {
      return {
        message: "Simulator is already started, please stop the simulator first",
        type: "error",
      }
    } else {
      socket.emit("connAck", ports)
      return {
        message: "Simulator successfully started,"
      }
    }
  })

  socket.on("stop-simulator", (_) => {
    for (const proc of processes) {
      proc.kill("SIGTERM")
    }
    ports = []
    processes = []
    socket.emit("connAck", ports)
  })

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

