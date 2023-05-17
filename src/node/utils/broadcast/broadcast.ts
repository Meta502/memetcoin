import _ from "lodash"
import { Flag } from "../../../constants"
import { udpSocket } from "../initUdpSocket"
import minimist from "minimist"

const argv = minimist(process.argv.slice(2))

const NODE_PORT = argv[Flag.PORT]
const NEIGHBOR_PORTS = argv[Flag.NEIGHBOR_PORTS]
  .split(",")
  .filter((port: number) => port != NODE_PORT)

export default function broadcast(data: string) {
  NEIGHBOR_PORTS.forEach((port: number | string) => {
    udpSocket.send(
      data,
      Number(port),
    )
  })
}

export function broadcastGossip(data: string) {
  const selectedNodes = _.sampleSize(NEIGHBOR_PORTS, Math.floor((NEIGHBOR_PORTS.length + 1) / 2))
  selectedNodes.forEach((port: number | string) => {
    udpSocket.send(
      data,
      Number(port),
    )
  })
}
