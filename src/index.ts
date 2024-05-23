import { BlockChain } from './blockchain'

const blockchain = new BlockChain(Number(process.argv[2] || 4))
const blockNumber = +process.argv[3] || 10
let chain = blockchain.chain


for (let i = 1; i <= blockNumber; i++) {
  const block = blockchain.createBlock(`Block ${i}`)
  const mineInfo = blockchain.mineBlock(block)
  chain = blockchain.pushBlock(mineInfo.minedBlock)
}

console.log('--- GENERATED CHAIN ---\n')
console.log(chain)

const fs = require('node:fs');
fs.readFile('src/arquivo.csv', 'utf8', (err: any, data: any) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
  var linhas = data.split("\r\n", 3);
  console.log(linhas);
  var  i = 0;
  var colunas = [];
  for(i =0 ; i < 3; i++){
    colunas[i] = linhas[i];
    var items = colunas[i].split(";", 3);
    console.log(items);
  }
});

const content = 'Some content!';
fs.writeFile('src/resumeBlockchain.txt', content, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});


