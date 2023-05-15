import dgram from "node:dgram"
import { MessageType } from "../schema/broadcast";
import handleBlockchainResponse from "./broadcast//handleBlockchainResponse";
import handleLatestBlockQuery from "./broadcast/handleLatestBlockQuery";
import handleChainQuery from "./broadcast/handleChainQuery";

export const udpSocket = dgram.createSocket("udp4");

const initUdpSocket = (port: number, { privateKey, publicKey, address }) => {
  udpSocket.on("error", (err) => {
    console.error(err)
    udpSocket.close()
  })

  udpSocket.on("message", (msg, rinfo) => {
    try {
      const message = JSON.parse(
        msg.toString("utf8")
      );

      if (message.type === MessageType.RESPONSE_BLOCKCHAIN) {
        return handleBlockchainResponse(message)
      }

      if (message.type === MessageType.QUERY_ALL) {
        return handleChainQuery(rinfo.port)
      }

      if (message.type === MessageType.QUERY_LATEST) {
        return handleLatestBlockQuery(rinfo.port)
      }

    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error("Malformed broadcast received")
        return
      }
      throw e
    }
  })

  udpSocket.on("listening", () => {
    const { address, port } = udpSocket.address()
    console.log(`[INFO] (${address}, ${port}): Start listening to UDP messages`)
  })

  udpSocket.bind(
    port
  )

  return udpSocket
}

export default initUdpSocket
