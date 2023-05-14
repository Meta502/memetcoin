export default function hashToBinary(hash: string): string {
  let returnValue: string = ""

  for (let i = 0; i < hash.length; i++) {
    returnValue += ("0000" + (parseInt(hash.charAt(i), 16)).toString(2)).substr(-4);
  }

  return returnValue
}
