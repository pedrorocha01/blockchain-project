import { BlockChain } from './blockchain'

const blockchain = new BlockChain(Number(process.argv[2] || 4))
const blockNumber = +process.argv[3] || 10
let chain = blockchain.chain

const readline = require("readline")
const fs = require("fs")
const line = readline.createInterface({
  input: fs.createReadStream("C:\Users\pedro\OneDrive\Área de Trabalho\typescript-blockchain-main\src\arquivo.csv")
});

line.on( "line", (data: any) =>{
  console.log(data);
});


for (let i = 1; i <= blockNumber; i++) {
  const block = blockchain.createBlock(`Block ${i}`)
  const mineInfo = blockchain.mineBlock(block)
  chain = blockchain.pushBlock(mineInfo.minedBlock)
}

console.log('--- GENERATED CHAIN ---\n')
console.log(chain)
