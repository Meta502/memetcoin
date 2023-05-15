import { getLatestBlock } from "../../data/blockchain";
import { MessageType } from "../../schema/broadcast";
import { udpSocket } from "../initUdpSocket";

export default function handleLatestBlockQuery(sourcePort: number) {
  udpSocket.send(
    JSON.stringify({
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: [getLatestBlock()]
    }),
    sourcePort
  )
}
