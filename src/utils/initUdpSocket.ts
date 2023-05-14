import dgram from "node:dgram"
import { MessageType } from "../schema/broadcast";
import handleBlockchainResponse from "./block/handleBlockchainResponse";

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
        return handleBlockchainResponse(message);
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error("Malformed broadcast received")
        return
      } else {
        throw e
      }
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
