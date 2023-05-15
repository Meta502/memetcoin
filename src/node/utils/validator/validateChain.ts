import { Block, genesisBlock } from "../../schema/block";
import validateNewBlockIntegrity from "./validateBlockIntegrity";

export default function validateChain(chain: Block[]): boolean {
  const validateGenesis = (block: Block): boolean => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  }

  if (!validateGenesis(chain[0])) {
    return false;
  }

  let chainLength = chain.length;

  for (let i = 1; i < chainLength; i++) {
    if (!validateNewBlockIntegrity(chain[i], chain[i - 1])) {
      return false;
    }
  }

  return true
}
