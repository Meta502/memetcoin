import { Block } from "../../schema/block";

export default function getAccumulatedDifficulty(chain: Block[]): number {
  return chain
    .map((block) => block.difficulty)
    .reduce((a, b) => a + Math.pow(2, b))
}
