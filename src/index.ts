import minimist from "minimist"
import { ChildProcess, spawn } from "node:child_process"
import path from "path"

import { Flag } from "./constants"

const argv = minimist(process.argv.slice(2))
const nodePath = path.resolve(__dirname, 'node.js')

async function main() {
  // Randomly generate basePort between 1 to 65535
  const basePort = argv["basePort"] || Math.floor(Math.random() * 65535)
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
    const node = spawn("node", [nodePath, `-p=${basePort + numSpawnedProcess}`, `--nodePorts=${ports.join(",")}`])

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
    const node = spawn("node", [nodePath, `-p ${basePort + numSpawnedProcess}`, `--nodePorts ${ports.join(",")}`])

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

main();
