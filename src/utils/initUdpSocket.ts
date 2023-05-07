import dgram from "node:dgram"

const initUdpSocket = (port: number) => {
  const server = dgram.createSocket("udp4");

  server.on("error", (err) => {
    console.error(err)
    server.close()
  })

  server.on("message", (msg, rinfo) => {
    console.log(`[MESSAGE FROM (${rinfo.address}, ${rinfo.port})] ${msg}`)
  })

  server.on("listening", () => {
    const { address, port } = server.address()
    console.log(`[INFO] (${address},${port}): Start listening to UDP messages`)
  })

  server.bind(
    port
  )

  return server
}

export default initUdpSocket
