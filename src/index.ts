import { BlockChain } from './blockchain'
import { hash} from './hashFunctions'

const fs = require('node:fs');
const path = require ('path');
const pathFile = 'src/files/';

// LISTA OS ARQUIVOS NO DIRETORIO
let files = fs.readdirSync(pathFile);
//arquivos atuais no diretorio
let currentFiles: string[] = [];
//blockchains temporarias já geradas
let blockchainFiles: string[] = [];
//novos arquivos 
let newFiles: string[] = [];
//blockchains temporarias já geradas
let newBlockchainFiles: string[] = [];

//ARQUIVOS DE VOTAÇÃO .csv
files.forEach( (file: any) => {
  if (path.extname(file) == ".csv")
    currentFiles.push(pathFile.concat(file));
})

//ARQUIVOS DE BLOCKCHAIN TEMPORARIA .txt
files.forEach( (file: any) => {
  if (path.extname(file) == ".txt")
    blockchainFiles.push(pathFile.concat(file));
})

//VERIFICANDO QUAIS SAO OS NOVOS ARQUIVOS
for (let i = 0; i < currentFiles.length; i++) {
  var currentFile = currentFiles[i].split(".");
  var exist = 0;
  for (let j = 0; j < blockchainFiles.length; j++) {
    var blockchainFile = blockchainFiles[j].split(".");
    if(currentFile[0] == blockchainFile[0]){
      exist++;
    } 
  }
  if(exist == 0){
    newFiles.push(currentFiles[i]);
  }
}
  
// VARIAVEL DE CONTROLE DE CRIAÇÃO DE BLOKCHAIN
var MODE = "new";
//PROPRIEDADES BLOCKCHAIN DE VOTOS
let voteData: string[] = [];
let opcoesVoto;
let qtdVotos: string[] = [];
let qtdOpcoes;
var qtdVotantes;
let resultados: string[] = [];

//CRIAÇÃO DAS BLOCKCHAINS TEMPORÁRIAS
for (let k = 0; k < newFiles.length; k++) {

try {
  const data = fs.readFileSync(newFiles[k], 'utf8');

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    qtdVotantes = size;
    qtdOpcoes = linhas[0].toString().split(';').length;
    opcoesVoto = linhas[0].split(";", qtdOpcoes);
    qtdVotos = new Array(qtdOpcoes).fill(0);

    let vote;
    let j = 0;
    for(let i = 0 ; i < qtdVotantes - 1; i++){
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

// CRIANDO BLOCKCHAIN TEMPORÁRIA
const newBlockchain = new BlockChain(Number(4), MODE, '', 0)
let newChain = newBlockchain.chain

for(let i = 0; i < qtdVotantes - 1; i++) {
  const newblock = newBlockchain.createBlock(voteData[i])
  const mineInfo = newBlockchain.mineBlock(newblock)
  newChain = newBlockchain.pushBlock(mineInfo.minedBlock)
}


try {
  fs.writeFileSync(newFiles[k], "\r\n".concat(resultados[k]), {flag: 'a+'});  
} catch (err) {
   console.error(err);
}


let dataVoteBlockchain: string = ';'

try {

       //escrevendo blockchain saída
       let dataBlockchain : string = '';
       let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
       dataBlockchain = dataBlockchain.concat(title, "\r\n");
       //HEADER
       let _nonce : string;
       let _blockHash : string;
       //PAYLOAD
       let _sequence : string;
       let _timestamp : string;
       let _data : any;
       let _previousHah :string;
       let line: string = '';
 
       for (let index = 0; index < qtdVotantes; index++) {
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

      let fileName = newFiles[k].toString().split('.', 2);
      let arquivoSaida = fileName[0].toString().concat('.txt');

      newBlockchainFiles.push(arquivoSaida);
  
  fs.writeFileSync(arquivoSaida, dataVoteBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

}

//AUDITORIA DOS ARQUIVOS
for (let k = 0; k < newFiles.length; k++) {

console.log("AUDITORIA DO ARQUIVO:" + newFiles[k]);

let auditingFile : string[] = [];
let auditingBlockchain : string[] = [];
     
try {
  const data = fs.readFileSync(newFiles[k], 'utf8');

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    for(let i = 0 ; i < size - 1 ; i++){
      auditingFile[i] = linhas[i+1].replace(";", ":");;
    }


} catch (err) {
  console.error(err);
}

try {
  const data = fs.readFileSync(newBlockchainFiles[k], 'utf8');

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    let blockData;
    for(let i = 0 ; i < size - 3; i++){
      blockData = linhas[i+2]
      blockData = blockData.split(";", 6);
      auditingBlockchain[i] = blockData[3];
    }

} catch (err) {
  console.error(err);
}

let fail = 0;
for (let index = 0; index < size - 3; index++) {
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

//LENDO BLOCKCHAIN RESUMO EXISTENTE

let dataResume: string = '';
let sizeBlockMain: number = 0;
let contentLastBlock: string = 'empty';
let lastSequence: number = 0;

try {
  const data = fs.readFileSync('src/resumeBlockchain.txt', 'utf8');
  
    var size = data.toString().split('\r\n').length;
    sizeBlockMain = size - 3;
    let content;

    if(size > 3){
      var linhas = data.split("\r\n", size);     
      for(let i = 0 ; i < size - 1; i++){        
        dataResume = dataResume.concat(linhas[i]).concat("\r\n");
        if(i == size - 2){
          // ultimo previousHash existente
          content = linhas[i].split(";", 6);
          contentLastBlock = content[1];
          lastSequence = Number(content[0]);
        }
      }
    }
    
} catch (err) {
  console.error(err);
}

// DEFININDO MODO DE CRIAÇÃO DE BLOCKCHAIN PRINCIPAL
if(contentLastBlock != 'empty'){
  MODE = 'add';
}
const blockchain = new BlockChain(Number(4), MODE, contentLastBlock, lastSequence)
const blockNumber = +process.argv[3] || 1
let chain = blockchain.chain


//GERANDO BLOCKCHAIN RESUMO DOS NOVOS ARQUIVOS 
let resumeChain: string[] = [];

for (let k = 0; k < newFiles.length; k++) {
try {
  const data = fs.readFileSync(newFiles[k], 'utf8');
  
    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    let hashResume = '';
    hashResume = hash(data);
    let strResultado = "_".concat(linhas[size-1]).concat("_");
    resumeChain[k] = "_ARQUIVO:_".concat(newFiles[k].concat(strResultado.concat(hashResume)));

} catch (err) {
  console.error(err);
}

}
 
for(let i = 0; i < resumeChain.length ; i++) {
  const block = blockchain.createBlock(resumeChain[i])
  const mineInfo = blockchain.mineBlock(block)
  chain = blockchain.pushBlock(mineInfo.minedBlock)
}

//ESCREVENDO BLOCKCHAIN SAÍDA
let dataBlockchain : string = '';
let inicio: number = 1;
let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
//let genesis : string = '0;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0;00/00/0000 00:00:00';
if(contentLastBlock == 'empty'){
  inicio = 0;
  dataBlockchain = dataBlockchain.concat(title, "\r\n");
}else{
  dataBlockchain = dataBlockchain.concat(dataResume);
}

 //HEADER
 let _nonce : string;
 let _blockHash : string;

 //PAYLOAD
 let _sequence : string;
 let _timestamp : string;
 let _data : string;
 let _previousHah :string;
 let line: string = '';

 if(chain.length != 0){
 for (let index = inicio; index < newFiles.length + 1; index++) {
    line = '';
    _nonce = chain[index].header.nonce.toString();
    _blockHash = chain[index].header.blockHash;
    _sequence = chain[index].payload.sequence.toString();
    if(MODE == 'add' && _sequence == '1'){
      _sequence = (Number(_sequence) + sizeBlockMain).toString();
      sizeBlockMain = Number(_sequence);
    }
    _timestamp = chain[index].payload.timestamp.toString();
    _data = chain[index].payload.data.toString();
    _previousHah = chain[index].payload.previousHash;
    line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", _data, ";", _nonce, ";", _timestamp)
    dataBlockchain = dataBlockchain.concat(line, "\r\n");
 }
}

try {
  fs.writeFileSync('src/resumeBlockchain.txt', dataBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

//ESCREVENDO ARQUIVOS JA AUDITADOS NO CONTROLE
let dataFiles = '';
for (let index = 0; index < newFiles.length; index++) {
  dataFiles = dataFiles.concat(newFiles[index]).concat("\r\n");
}

try {
fs.writeFileSync('src/auditados.csv', dataFiles, {flag: 'a+'});
// file written successfully
} catch (err) {
console.error(err);
}

// ARRAY DE ARQUIVOS NA ORDEM QUE FORAM ADICIONDOS AO BLOCO
let auditingFiles: string[] = [];

try {
  let data = fs.readFileSync('src/auditados.csv', 'utf8');
    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);

    for (let index = 0; index < size - 1; index++) {
      auditingFiles.push(linhas[index]);
    }

  } catch (err) {
  console.error(err);
  }


//AUDITORIA DOS RESULTADOS

  let arquivos;
  let resultadoBlockchain: string[] = [];
  let hashArquivo: string[] = [];
  let arquivoAtual: string[] = [];

  try {
    let data = fs.readFileSync('src/resumeBlockchain.txt', 'utf8');

      var size = data.toString().split('\r\n').length;
      var linhas = data.split("\r\n", size);
      let blockData;

      for (let k = 2; k < linhas.length - 1; k++) { 
      blockData = linhas[k];
      blockData = blockData.split(";", 6);
      let qtdArquivos = blockData[3].toString().split('_').length;
      arquivos = blockData[3].split('_', qtdArquivos);
          
      arquivoAtual.push(arquivos[2]);
      resultadoBlockchain.push(arquivos[3]);
      hashArquivo.push(arquivos[4]);

    }
  
  } catch (err) {
    console.error(err);
  }

for (let k = 0; k < auditingFiles.length; k++) {

  let fail = 0;
  console.log("AUDITORIA DO ARQUIVO:" + auditingFiles[k]);

  try {
    let data = fs.readFileSync(auditingFiles[k], 'utf8');

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);

    if(linhas[size - 1] == resultadoBlockchain[k]){
      console.log("Resultado da votação auditado:" + resultadoBlockchain[k]);
    }else{
        fail++;
    }

    if(hash(data) == hashArquivo[k]){
      console.log("Hash do arquivo de votação auditado:" + hashArquivo[k]);
    }else{
        fail++;
    }
  
  } catch (err) {
    console.error(err);
  }

  
  if(fail == 0){
    console.log("Resultado auditado com sucesso!\n");
  }else{
    console.log("Este registro foi adulterado.\n")
  }
  
}
