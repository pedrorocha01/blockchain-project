import { hash, isHashProofed } from './hashFunctions'

export interface Block {
  header: {
    nonce: number
    blockHash: string
  }
  payload: {
    sequence: number
    timestamp: number
    data: any
    previousHash: string
  }
}

export class BlockChain {
  #chain: Block[] = []
  private powPrefix = '0'

  constructor (private readonly difficulty: number = 4, private mode: string, private previousHashLastBlock: string, private lastSequence: number) {
    if(mode == "new"){
       this.#chain.push(this.createGenesisBlock())
    }else{
      this.#chain.push(this.createLinkLastBlock(previousHashLastBlock, lastSequence))
    }
  }

  private createGenesisBlock () {
    const payload = {
      sequence: 0,
      //timestamp: +new Date(),
      timestamp: 0,
      data: '0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000'
    }
    return {
      header: {
        nonce: 0,
        //blockHash: hash(JSON.stringify(payload))
        blockHash: '0000000000000000000000000000000000000000000000000000000000000000'
      },
      payload
    }
  }

  private createLinkLastBlock (previousHashLastBlock: string, lastSequence: number) {

    const payload = {
      sequence: lastSequence,
      timestamp: 0,
      data: '',
      previousHash: ''
    }
    return {
      header: {
        nonce:0,
        blockHash: previousHashLastBlock
      },
      payload
    }
  }


  private get lastBlock (): Block {
    return this.#chain.at(-1) as Block
  }

  get chain () {
    return this.#chain
  }

  private getPreviousBlockHash () {
    return this.lastBlock.header.blockHash
  }

  createBlock (data: any) {
    const newBlock = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data,
      previousHash: this.getPreviousBlockHash()
    }

    console.log(`Bloco criado: ${newBlock.sequence}: ${JSON.stringify(newBlock, null, 2)}`)
    return newBlock
  }

  mineBlock (block: Block['payload']) {
    let nonce = 0
    let startTime = +new Date()

    while (true) {
      const blockHash = hash(JSON.stringify(block))
      const proofingHash = hash(blockHash + nonce)

      if (isHashProofed({
        hash: proofingHash,
        difficulty: this.difficulty,
        prefix: this.powPrefix
      })) {
        const endTime = +new Date()
        const shortHash = blockHash.slice(0, 12)
        const mineTime = (endTime - startTime) / 1000

        console.log(`Bloco ${block.sequence} minerado em ${mineTime} segundos. Hash: ${shortHash} (${nonce} tentativas)`)

        return {
          minedBlock: { payload: { ...block }, header: { nonce, blockHash } },
          minedHash: proofingHash,
          shortHash,
          mineTime
        }
      }
      nonce++
    }
  }

  verifyBlock (block: Block) {
    if (block.payload.previousHash !== this.getPreviousBlockHash()) {
      console.error(`Bloco inválido #${block.payload.sequence}: A Hash do bloco anterior é "${this.getPreviousBlockHash().slice(0, 12)}" not "${block.payload.previousHash.slice(0, 12)}"`)
      return
    }

    if (!isHashProofed({
      hash: hash(hash(JSON.stringify(block.payload)) + block.header.nonce),
      difficulty: this.difficulty,
      prefix: this.powPrefix
    })) {
      console.error(`Bloco inválido #${block.payload.sequence}: A Hash não funcionou, nonce ${block.header.nonce} não é valido`)
      return
    }

    return true
  }

  pushBlock (block: Block) {
    if (this.verifyBlock(block)) this.#chain.push(block)
    console.log(`Bloco Adicionado: #${JSON.stringify(block, null, 2)}`)
    return this.#chain
  }
}
