import minimist from "minimist"
import util from "util"
import fs from "fs"

import { Flag } from "./constants";
import initUdpSocket from "./utils/initUdpSocket";
import initHttpServer from "./utils/initHttpServer";

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

const udpSocket = initUdpSocket(
  NODE_PORT
)

const expressApp = initHttpServer(
  NODE_PORT
)

setInterval(() => {
  NEIGHBOR_PORTS.forEach((item: number) => {
    udpSocket.send("Heartbeat", item)
  })
}, 10000)

