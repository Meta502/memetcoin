import { transactions } from "../../data/blockchain";
import { MessageType } from "../../schema/broadcast";
import { broadcastGossip } from "./broadcast";

export default function broadcastTransactionPool() {
  broadcastGossip(JSON.stringify({
    type: MessageType.RESPONSE_TRANSACTION_POOL,
    transactions
  }))
}
