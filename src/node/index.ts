import minimist from "minimist"
import util from "util"
import fs from "fs"
import crypto from "crypto"

import sha256 from "sha256"
import RIPEMD160 from "ripemd160"

import { Flag } from "../constants";
import initUdpSocket from "./utils/initUdpSocket";
import initHttpServer from "./utils/initHttpServer";
import { EventEmitter } from "stream"

const argv = minimist(process.argv.slice(2))

const NODE_PORT = argv[Flag.PORT]
const NEIGHBOR_PORTS = argv[Flag.NEIGHBOR_PORTS]
  .split(",")
  .filter((port: number) => port != NODE_PORT)

const log_file = fs.createWriteStream(process.cwd() + `/logs/node-${NODE_PORT}.log`, { flags: 'w' });
const log_stdout = process.stdout;

console.log = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

export const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',
  publicKeyEncoding: {
    type: 'spki',
    format: 'der'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'der',
  }
});
console.log("private: " + privateKey.toString("hex"))
console.log("public: " + publicKey.toString("hex"))


const address = new RIPEMD160().update(sha256(publicKey.toString("base64"))).digest("base64")

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
