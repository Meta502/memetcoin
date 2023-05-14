import { getLatestBlock } from "../../data/blockchain";
import { MessageType } from "../../schema/broadcast";
import { udpSocket } from "../initUdpSocket";

export default function broadcastLatestBlock(neighborPorts: (number | string)[]) {
  neighborPorts.forEach((port: number | string) => {
    udpSocket.send(
      JSON.stringify({
        type: MessageType.RESPONSE_BLOCKCHAIN,
        blocks: [getLatestBlock()],
      }),
      Number(port),
    )
  })
}
