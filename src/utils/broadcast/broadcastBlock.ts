import { Flag } from "../../constants";
import { getLatestBlock } from "../../data/blockchain";
import { MessageType } from "../../schema/broadcast";
import { udpSocket } from "../initUdpSocket";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2))

const NODE_PORT = argv[Flag.PORT]
const NEIGHBOR_PORTS = argv[Flag.NEIGHBOR_PORTS]
  .split(",")
  .filter((port: number) => port != NODE_PORT)

export default function broadcastLatestBlock() {
  NEIGHBOR_PORTS.forEach((port: number | string) => {
    udpSocket.send(
      JSON.stringify({
        type: MessageType.RESPONSE_BLOCKCHAIN,
        blocks: [getLatestBlock()],
      }),
      Number(port),
    )
  })
}
