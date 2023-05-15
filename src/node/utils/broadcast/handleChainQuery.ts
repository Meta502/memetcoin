import { blockchain } from "../../data/blockchain";
import { MessageType } from "../../schema/broadcast";
import { udpSocket } from "../initUdpSocket";

export default function handleChainQuery(sourcePort: number) {
  udpSocket.send(
    JSON.stringify({
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: blockchain,
    }),
    sourcePort
  )
}
