import RIPEMD160 from "ripemd160"
import sha256 from "sha256"

export default function calculateAddressFromPublicKey(publicKey: Buffer) {
  return new RIPEMD160().update(
    sha256(publicKey.toString("base64"))
  ).digest("base64")
}
