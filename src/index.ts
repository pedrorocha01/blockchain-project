import { BlockChain } from './blockchain'

const blockchain = new BlockChain(Number(process.argv[2] || 4))
const blockNumber = +process.argv[3] || 10
let chain = blockchain.chain

const fs = require('node:fs');

//BLOCKCHAIN DE VOTOS
let voteData: string[] = [];
let opcoesVoto: string[] = [];
let qtdVotos: number[] = [];
try {
  const data = fs.readFileSync('src/votos.csv', 'utf8');
  console.log(data);

    //const qtdlinhas = data.match('\r\n');
    const qtdLinhas = 10;
    const count = qtdLinhas + 1;
    var linhas = data.split("\r\n", count);
    opcoesVoto = linhas[0].split(";", 3);
    console.log(linhas);
    console.log(opcoesVoto);
    let vote;
    let j = 0;
    for(let i = 0 ; i < qtdLinhas ; i++){
      voteData[i] = linhas[i+1];
      vote = voteData[i].split(";", 2);
      for (let j = 0; j < opcoesVoto.length; j++) {
        if(vote = opcoesVoto[j]){
          qtdVotos[j] = (qtdVotos[j] != undefined) ? qtdVotos[j] = 1 : qtdVotos[j] = qtdVotos[j] + 1;
        }
      }
    }
    console.log(qtdVotos);

} catch (err) {
  console.error(err);
}

const newBlockchain = new BlockChain(Number(4))
const newblockNumber = 10
let newChain = newBlockchain.chain

for(let i = 0; i < newblockNumber; i++) {
  const newblock = newBlockchain.createBlock(voteData[i])
  const mineInfo = newBlockchain.mineBlock(newblock)
  newChain = newBlockchain.pushBlock(mineInfo.minedBlock)
}

console.log('--- GENERATED CHAIN ---\n')
console.log(newChain)

let dataVoteBlockchain: string = ';'

try {

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
           _nonce = newChain[index].header.nonce.toString();
           _blockHash = newChain[index].header.blockHash;
           _sequence = newChain[index].payload.sequence.toString();
           _timestamp = newChain[index].payload.timestamp.toString();
           _data = newChain[index].payload.data;
           _previousHah = newChain[index].payload.previousHash;
           line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", "DADOS: " , _data, ";", _nonce, ";", _timestamp);
           dataBlockchain = dataBlockchain.concat(line, "\r\n");
       }
 
       dataVoteBlockchain = dataBlockchain;

  fs.writeFileSync('src/newResumeBlockchain.txt', dataVoteBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

//BLOCKCHAIN RESUMO
let resumeChain: string[] = [];

try {
  const data = fs.readFileSync('src/newResumeBlockchain.txt', 'utf8');
  console.log(data);
  

    let resumeBlock: string = '';
    //const qtdlinhas = data.match('\r\n');
    const qtdlinhas = 10;
    const count = qtdlinhas + 1;
    var linhas = data.split("\r\n", count);
    const genesisblock:string = linhas[1];
    console.log(linhas);

    for(let i = 1 ; i < count ; i++){
      resumeBlock = '';
      resumeBlock = resumeBlock.concat(linhas[i].toString());
      resumeBlock = resumeBlock.concat("\r\n");
      console.log(resumeBlock);
      console.log("\n");
      resumeChain[i] = resumeBlock;
    }
} catch (err) {
  console.error(err);
}

  for(let i = 0; i < blockNumber; i++) {
    const block = blockchain.createBlock(resumeChain[i])
    const mineInfo = blockchain.mineBlock(block)
    chain = blockchain.pushBlock(mineInfo.minedBlock)
  }

  console.log('--- GENERATED CHAIN ---\n')
  console.log(chain)

 //escrevendo blockchain saída
 let dataBlockchain : string = '';
 let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
 //let genesis : string = '0;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0;00/00/0000 00:00:00';
 dataBlockchain = dataBlockchain.concat(title, "\r\n");
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
    line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", "DADOS: " , _data, ";", _nonce, ";", _timestamp)
    dataBlockchain = dataBlockchain.concat(line, "\r\n");
 }

try {
  fs.writeFileSync('src/resumeBlockchain.txt', dataBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}












