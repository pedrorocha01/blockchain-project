import { BlockChain } from './blockchain'

const blockchain = new BlockChain(Number(process.argv[2] || 4))
const blockNumber = +process.argv[3] || 10
let chain = blockchain.chain

let resumeChain: string[] = [];
const fs = require('node:fs');
try {
  const data = fs.readFileSync('src/arquivo.csv', 'utf8');
  console.log(data);
  

    let resumeBlock: string = '';
    //const qtdlinhas = data.match('\r\n');
    const qtdlinhas = 10;
    const count = qtdlinhas + 2;
    var linhas = data.split("\r\n", count);
    var qtLine:number = qtdlinhas;
    const qtBlock:number = blockNumber;
    const atributos:string = linhas[0];
    const genesisblock:string = linhas[1];
    console.log(linhas);
    
    var  i = 0;
    var j = 0;
    let linha = 2;
    let lastLine = (qtLine/qtBlock)+2;
    for(i = 0 ; i < qtBlock ; i++){
      resumeBlock = ''
      for(j = linha ; j < lastLine ; j++){
        resumeBlock = resumeBlock.concat(linhas[j].toString());
        resumeBlock = resumeBlock.concat("\r\n");
      }
      console.log(resumeBlock);
      console.log("\n");
      resumeChain[i] = resumeBlock;
      linha = linha + (qtLine/qtBlock);
      lastLine = lastLine + (qtLine/qtBlock);
    }
} catch (err) {
  console.error(err);
}

  for(let i = 0; i < blockNumber; i++) {
    const block = blockchain.createBlock(resumeChain[i])
    // criar rede
    const mineInfo = blockchain.mineBlock(block)
    chain = blockchain.pushBlock(mineInfo.minedBlock)
  }

  console.log('--- GENERATED CHAIN ---\n')
  console.log(chain)

 //escrevendo blockchain saída
 let dataBlockchain : string = '';
 let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
 let genesis : string = '0;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0;00/00/0000 00:00:00';
 dataBlockchain = dataBlockchain.concat(title, "\r\n", genesis, "\r\n");
 //header
 let _nonce : string;
 let _blockHash : string;
 //payload
 let _sequence : string;
 let _timestamp : string;
 let _data : any;
 let _previousHah :string;
 let line: string = '';

 for (let index = 0; index < blockNumber+1; index++) {
    line = '';
    _nonce = chain[index].header.nonce.toString();
    _blockHash = chain[index].header.blockHash;
    _sequence = chain[index].payload.sequence.toString();
    _timestamp = chain[index].payload.timestamp.toString();
    _data = chain[index].payload.data;
    _previousHah = chain[index].payload.previousHash;
    line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", "\r\nDADOS: " , _data, ";\r\n", _nonce, ";", _timestamp, "\r\n")
    dataBlockchain = dataBlockchain.concat(line);
 }

try {
  fs.writeFileSync('src/resumeBlockchain.txt', dataBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}







