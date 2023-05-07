import minimist from "minimist"

import { Flag } from "./constants";
import initUdpSocket from "./utils/initUdpSocket";
import initHttpServer from "./utils/initHttpServer";

const argv = minimist(process.argv.slice(2))

const NODE_PORT = argv[Flag.PORT]
const NEIGHBOR_PORTS = argv[Flag.NEIGHBOR_PORTS]
  .split(",")
  .filter((port: number) => port != NODE_PORT)

const udpSocket = initUdpSocket(
  NODE_PORT
)

initHttpServer(
  NODE_PORT
)

setInterval(() => {
  NEIGHBOR_PORTS.forEach((item: number) => {
    udpSocket.send("Ping!", item)
  })
}, 1000)
