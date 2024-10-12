import { BlockChain } from './blockchain'
import { hash, isHashProofed } from './helpers'

const blockchain = new BlockChain(Number(process.argv[2] || 4))
const blockNumber = +process.argv[3] || 10
let chain = blockchain.chain

const fs = require('node:fs');
const path = require('path');

// LISTA OS ARQUIVOS NO DIRETORIO
let files = fs.readdirSync('src/');

console.log("Arquivos .csv :");
files.forEach( (file: any) => {
  if (path.extname(file) == ".csv")
    console.log(file);
})

console.log("Arquivos .txt :");
files.forEach( (file: any) => {
  if (path.extname(file) == ".txt")
    console.log(file);
})

//BLOCKCHAIN DE VOTOS
let voteData: string[] = [];
let opcoesVoto;
let qtdVotos: string[] = [];
let qtdOpcoes = 3;
let qtdVotantes = 10;

//ARQUIVOS
const qtdArq = 3;
let resultados: string[] = [];

const arq1 = 'src/votos.csv';
const arq2 = 'src/votos2.csv';
const arq3 = 'src/votos3.csv';
const arquivos: string[] = [];
arquivos[0] = arq1;
arquivos[1] = arq2;
arquivos[2] = arq3;

const arqSaida1 = 'src/voteBlockchain.txt';
const arqSaida2 = 'src/voteBlockchain2.txt';
const arqSaida3 = 'src/voteBlockchain3.txt';
const arquivoSaida: string[] = [];
arquivoSaida[0] = arqSaida1;
arquivoSaida[1] = arqSaida2;
arquivoSaida[2] = arqSaida3;

for (let k = 0; k < qtdArq; k++) {
  
try {
  const data = fs.readFileSync(arquivos[k], 'utf8');
  console.log(data);

    //const qtdlinhas = data.match('\r\n');
    const qtdLinhas = qtdVotantes;
    const count = qtdLinhas + 1;
    var linhas = data.split("\r\n", count);
    opcoesVoto = linhas[0].split(";", qtdOpcoes);
    qtdVotos = new Array(qtdOpcoes).fill(0);
    console.log(linhas);
    console.log(opcoesVoto);
    let vote;
    let j = 0;
    for(let i = 0 ; i < qtdLinhas ; i++){
      voteData[i] = linhas[i+1];
      vote = voteData[i].split(";", 2);
      for (let j = 0; j < opcoesVoto.length; j++) {
        if(vote[1] == opcoesVoto[j]){
          qtdVotos[j] = qtdVotos[j] + 1;
        }
      }
    }
    console.log(qtdVotos);


} catch (err) {
  console.error(err);
}

let resultado = 'RESULTADO: |';
for (let j = 0; j < qtdVotos.length; j++) {
  resultado = resultado.concat(opcoesVoto[j]).concat(":").concat(qtdVotos[j]).concat("|");
}
resultados[k] = resultado;

const newBlockchain = new BlockChain(Number(4))
let newChain = newBlockchain.chain

for(let i = 0; i < qtdVotantes; i++) {
  const newblock = newBlockchain.createBlock(voteData[i])
  const mineInfo = newBlockchain.mineBlock(newblock)
  newChain = newBlockchain.pushBlock(mineInfo.minedBlock)
}

//console.log('--- GENERATED CHAIN ---\n')
//console.log(newChain)

let dataVoteBlockchain: string = ';'

try {

       //escrevendo blockchain saída
       let dataBlockchain : string = '';
       let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
       //let genesis : string = '0;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0;00/00/0000 00:00:00';
       //dataBlockchain = dataBlockchain.concat(title, "\r\n", genesis, "\r\n");
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
 
       for (let index = 0; index < qtdVotantes+1; index++) {
           line = '';
           _nonce = newChain[index].header.nonce.toString();
           _blockHash = newChain[index].header.blockHash;
           _sequence = newChain[index].payload.sequence.toString();
           _timestamp = newChain[index].payload.timestamp.toString();
           _data = newChain[index].payload.data;
           _data = _data.replace(";", ":");
           _previousHah = newChain[index].payload.previousHash;
           line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", _data, ";", _nonce, ";", _timestamp);
           dataBlockchain = dataBlockchain.concat(line, "\r\n");
       }
 
       dataVoteBlockchain = dataBlockchain;

  fs.writeFileSync(arquivoSaida[k], dataVoteBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

}

//AUDITORIA DOS ARQUIVOS
for (let k = 0; k < qtdArq; k++) {

console.log("AUDITORIA DO ARQUIVO:" + arquivos[k]);

let auditingFile : string[] = [];
let auditingBlockchain : string[] = [];
     
try {
  const data = fs.readFileSync(arquivos[k], 'utf8');
  //console.log(data);

    //const qtdlinhas = data.match('\r\n');
    const qtdLinhas = qtdVotantes;
    const count = qtdLinhas + 1;
    var linhas = data.split("\r\n", count);
    //console.log(linhas);
    for(let i = 0 ; i < qtdLinhas ; i++){
      auditingFile[i] = linhas[i+1].replace(";", ":");;
    }


} catch (err) {
  console.error(err);
}

try {
  const data = fs.readFileSync(arquivoSaida[k], 'utf8');
  //console.log(data);

    //const qtdlinhas = data.match('\r\n');
    const qtdLinhas = qtdVotantes;
    const count = qtdLinhas + 2;
    var linhas = data.split("\r\n", count);
    //console.log(linhas);
    let blockData;
    for(let i = 0 ; i < qtdLinhas ; i++){
      blockData = linhas[i+2]
      blockData = blockData.split(";", 6);
      auditingBlockchain[i] = blockData[3];
    }

} catch (err) {
  console.error(err);
}

let fail = 0;
for (let index = 0; index < qtdVotantes; index++) {
    if(auditingBlockchain[index] == auditingFile[index]){
      console.log("Voto auditado:" + auditingFile[index]);
    }else{
        fail++;
    }
}

if(fail == 0){
  console.log("Todos os votos auditados com sucesso!\n");
}else{
  console.log(fail + " votos foram adulterados.\n")
}

}


//BLOCKCHAIN RESUMO
let resumeChain: string[] = [];

for (let k = 0; k < qtdArq; k++) {
try {
  const data = fs.readFileSync(arquivoSaida[k], 'utf8');
  //console.log(data);
  
    let resumeBlock: string = '';
    //const qtdlinhas = data.match('\r\n');
    const qtdlinhas = qtdVotantes;
    const count = qtdlinhas + 1;
    var linhas = data.split("\r\n", count);
    const genesisblock:string = linhas[1];
    //console.log(linhas);
    let hashLinha;
    let hashResume = '';

    for(let i = 1 ; i < count ; i++){
      resumeBlock = '';
      resumeBlock = resumeBlock.concat(linhas[i].toString());
      resumeBlock = resumeBlock.concat("\r\n");
      hashLinha = linhas[i].split(";", count);
      hashResume = hashResume.concat(hashLinha[1]);
      //console.log(hashResume);
      console.log("\n");
      // resumeChain[i] = resumeBlock;
    }
    hashResume = hash(hashResume);
    resumeChain[k] = resultados[k].concat("HASH RESUMO:").concat(hashResume);

} catch (err) {
  console.error(err);
}

}

  for(let i = 0; i < blockNumber; i++) {
    const block = blockchain.createBlock(resumeChain[i])
    const mineInfo = blockchain.mineBlock(block)
    chain = blockchain.pushBlock(mineInfo.minedBlock)
  }

  //console.log('--- GENERATED CHAIN ---\n')
  //console.log(chain)

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
    line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", _data, ";", _nonce, ";", _timestamp)
    dataBlockchain = dataBlockchain.concat(line, "\r\n");
 }

try {
  fs.writeFileSync('src/resumeBlockchain.txt', dataBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

//AUDITORIA DOS RESULTADOS
for (let k = 0; k < qtdArq; k++) {

  console.log("AUDITORIA DO ARQUIVO:" + arquivos[k]);
  
  let resultadoBlockchain;
  let resultado = 'RESULTADO: |';
       
  try {
    const data = fs.readFileSync(arquivos[k], 'utf8');
    //console.log(data);

    const qtdLinhas = qtdVotantes;
    const count = qtdLinhas + 1;
    var linhas = data.split("\r\n", count);
    opcoesVoto = linhas[0].split(";", qtdOpcoes);
    qtdVotos = new Array(qtdOpcoes).fill(0);
    console.log(linhas);
    //console.log(opcoesVoto);
    let vote;
    let j = 0;
    for(let i = 0 ; i < qtdLinhas ; i++){
      voteData[i] = linhas[i+1];
      vote = voteData[i].split(";", 2);
      for (let j = 0; j < opcoesVoto.length; j++) {
        if(vote[1] == opcoesVoto[j]){
          qtdVotos[j] = qtdVotos[j] + 1;
        }
      }
    }
    console.log(qtdVotos);

   
    for (let j = 0; j < qtdVotos.length; j++) {
        resultado = resultado.concat(opcoesVoto[j]).concat(":").concat(qtdVotos[j]).concat("|");
    } 
  
  } catch (err) {
    console.error(err);
  }
  
  try {
    const data = fs.readFileSync('src/resumeBlockchain.txt', 'utf8');
    //console.log(data);
  
      //const qtdlinhas = data.match('\r\n');
      const qtdLinhas = qtdVotantes;
      const count = qtdLinhas + 2;
      var linhas = data.split("\r\n", count);
      //console.log(linhas);
      let blockData;
      blockData = linhas[k+2];
      blockData = blockData.split(";", 6);
      blockData = blockData[3].split("HASH", 2);
      resultadoBlockchain = blockData[0];
  
  } catch (err) {
    console.error(err);
  }
  
  let fail = 0;
      if(resultadoBlockchain == resultado){
        console.log("Resultado da votação auditado:" + resultado);
      }else{
          fail++;
      }

  
  if(fail == 0){
    console.log("Resultado auditado com sucesso!\n");
  }else{
    console.log("Este registro foi adulterado.\n")
  }
  
  }












