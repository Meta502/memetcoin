import minimist from "minimist"
import util from "util"
import fs from "fs"
import ecdsa from "elliptic"

import { Flag } from "../constants";
import initUdpSocket from "./utils/initUdpSocket";
import initHttpServer from "./utils/initHttpServer";

const argv = minimist(process.argv.slice(2))

export const BASE_PORT = argv["basePort"]
export const NODE_PORT = argv[Flag.PORT]

const log_file = fs.createWriteStream(process.cwd() + `/logs/node-${NODE_PORT}.log`, { flags: 'w' });
const log_stdout = process.stdout;

console.log = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const EC = new ecdsa.ec("secp256k1")

const keyPair = EC.genKeyPair()

export const privateKey = keyPair.getPrivate().toString(16)
export const publicKey = keyPair.getPublic().encode("hex", true)

const address = publicKey

const nodeDetails = {
  privateKey,
  publicKey,
  address,
}

const udpSocket = initUdpSocket(
  NODE_PORT,
  nodeDetails,
)

initHttpServer(
  NODE_PORT,
  nodeDetails,
)

