import { Flag } from "../../../constants";
import { getLatestBlock } from "../../data/blockchain";
import { MessageType } from "../../schema/broadcast";
import minimist from "minimist";
import broadcast from "./broadcast";

const argv = minimist(process.argv.slice(2))

const NODE_PORT = argv[Flag.PORT]

export default function broadcastLatestBlock() {
  broadcast(
    JSON.stringify({
      type: MessageType.RESPONSE_BLOCKCHAIN,
      blocks: [getLatestBlock()],
    })
  )
}
