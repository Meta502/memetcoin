export class TxOutput {
  public address: string;
  public amount: number;

  constructor(address: string, amount: number) {
    this.address = address
    this.amount = amount
  }
}

export class TxInput {
  public txOutputId: string;
  public txOutputIndex: number;
  public signature: string;

  constructor(txOutputId: string, txOutputIndex: number, signature: string) {
    this.txOutputId = txOutputId
    this.txOutputIndex = txOutputIndex
    this.signature = signature
  }
}

export class Transaction {
  public id: string = ""
  public txInputs: TxInput[] = []
  public txOutputs: TxOutput[] = []
}

export class UnspentTxOutput {
  public readonly txOutputId: string
  public readonly txOutputIndex: number
  public readonly address: string
  public readonly amount: number

  constructor(txOutputId: string, txOutputIndex: number, address: string, amount: number) {
    this.txOutputId = txOutputId
    this.txOutputIndex = txOutputIndex
    this.address = address
    this.amount = amount
  }
}
