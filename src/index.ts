import { BlockChain } from './blockchain'
import { hash} from './helpers'

const blockchain = new BlockChain(Number(process.argv[2] || 4))
const blockNumber = +process.argv[3] || 3
let chain = blockchain.chain

const LIMITE = blockNumber;
var qtdBlocos: number = 0;

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
//arquivos prontos para ser resumidos em um bloco
let filestoResume: string[] = [];
//arquivos que serão resumidos no próximo processamento
let nextFilestoResume: string[] = [];

//ARQUIVOS DE VOTAÇÃO
console.log("Arquivos .csv :");
files.forEach( (file: any) => {
  if (path.extname(file) == ".csv")
    currentFiles.push(pathFile.concat(file));
})

console.log(currentFiles);

//ARQUIVOS DE BLOCKCHAIN TEMPORARIA
console.log("Arquivos .txt :");
files.forEach( (file: any) => {
  if (path.extname(file) == ".txt")
    blockchainFiles.push(pathFile.concat(file));
})

console.log(blockchainFiles);

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

//ESCREVENDO NOVOS ARQUIVOS NO CONTROLE
let dataFiles = '';
for (let index = 0; index < newFiles.length; index++) {
  dataFiles = dataFiles.concat(newFiles[index]).concat("\r\n");
}

try {
fs.writeFileSync('src/controle.csv', dataFiles, {flag: 'a+'});
// file written successfully
} catch (err) {
console.error(err);
}

//LEITURA DO ARQUIVO DE CONTROLE DE BLOCO
// verificar se existe a quantidade suficiente para gerar um bloco
try {
  const data = fs.readFileSync('src/controle.csv', 'utf8');
  
  var size = data.toString().split('\r\n').length;
  var linhas = data.split("\r\n", size);

  let resto = (size-1) % LIMITE;
  if(resto == 0){
    qtdBlocos = (size -1)/LIMITE;
  }else{
    qtdBlocos = Math.floor(size/LIMITE);
  }

  for (let index = 0; index < size - 1; index++) {
    if(index <= (LIMITE * qtdBlocos)){
      filestoResume.push(linhas[index]);
    }else if(index > (LIMITE * qtdBlocos)){
      nextFilestoResume.push(linhas[index]);
    }
  }
 
} catch (err) {
  console.error(err);
}

//ESCREVENDO ARQUIVOS RESTANTES NO CONTROLE
dataFiles = '';
for (let index = 0; index < nextFilestoResume.length; index++) {
  dataFiles = dataFiles.concat(nextFilestoResume[index]).concat("\r\n");
}

try {
fs.writeFileSync('src/controle.csv', dataFiles);
// file written successfully
} catch (err) {
console.error(err);
}


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
  //console.log(data);

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    qtdVotantes = size;
    qtdOpcoes = linhas[0].toString().split(';').length;
    opcoesVoto = linhas[0].split(";", qtdOpcoes);
    qtdVotos = new Array(qtdOpcoes).fill(0);
    //console.log(linhas);
    //console.log(opcoesVoto);
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

const newBlockchain = new BlockChain(Number(4))
let newChain = newBlockchain.chain

for(let i = 0; i < qtdVotantes - 1; i++) {
  const newblock = newBlockchain.createBlock(voteData[i])
  const mineInfo = newBlockchain.mineBlock(newblock)
  newChain = newBlockchain.pushBlock(mineInfo.minedBlock)
}

//console.log('--- GENERATED CHAIN ---\n')
//console.log(newChain)

try {
  fs.writeFileSync(newFiles[k], "\n".concat(resultados[k]), {flag: 'a+'});  
} catch (err) {
   console.error(err);
}


let dataVoteBlockchain: string = ';'

try {

       //escrevendo blockchain saída
       let dataBlockchain : string = '';
       let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
       //let genesis : string = '0;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0;00/00/0000 00:00:00';
       //dataBlockchain = dataBlockchain.concat(title, "\r\n", genesis, "\r\n");
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
  //console.log(data);

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    //console.log(linhas);
    for(let i = 0 ; i < size - 1 ; i++){
      auditingFile[i] = linhas[i+1].replace(";", ":");;
    }


} catch (err) {
  console.error(err);
}

try {
  const data = fs.readFileSync(newBlockchainFiles[k], 'utf8');
  //console.log(data);

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    //console.log(linhas);
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

let dataResume: string[] = [];
let currentSize: number = 0;

try {
  const data = fs.readFileSync('src/resumeBlockchain.txt', 'utf8');
  
    var size = data.toString().split('\r\n').length;
    currentSize = size-2;

    if(size.length > 2){
      var linhas = data.split("\r\n", size);
      //const genesisblock:string = linhas[1];
  
      for(let i = 2 ; i < size - 1 ; i++){
        let content = linhas[i].split(";", 6);
        dataResume[i-2] = content[3];
      }   
  
      for(let i = 0; i < size-1; i++) {
        const block = blockchain.createBlock(dataResume[i])
        const mineInfo = blockchain.mineBlock(block)
        chain = blockchain.pushBlock(mineInfo.minedBlock)
      }
    }
    
} catch (err) {
  console.error(err);
}


//GERANDO BLOCKCHAIN RESUMO DOS NOVOS ARQUIVOS
let resumeChain: string[] = [];
let newBlocks: string[] = [];
let resumeResult = '';
let currentLIMITE = LIMITE;

for (let k = 0; k < newBlockchainFiles.length; k++) {
try {
  const data = fs.readFileSync(newBlockchainFiles[k], 'utf8');
  
    let resumeBlock: string = '';
    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    //const genesisblock:string = linhas[1];
    let hashLinha;
    let hashResume = '';

    for(let i = 1 ; i < size - 2 ; i++){
      resumeBlock = '';
      resumeBlock = resumeBlock.concat(linhas[i].toString());
      resumeBlock = resumeBlock.concat("\r\n");
      hashLinha = linhas[i].split(";", size);
      hashResume = hashResume.concat(hashLinha[1]);
      console.log("\n");
    }
    hashResume = hash(hashResume);
    resumeChain[k] = filestoResume[k].concat(resultados[k].concat("HASH DA BLOCKCHAIN:").concat(hashResume));
    resumeResult = resumeResult.concat(resumeChain[k]);

    
    if(k == currentLIMITE - 1){{
        newBlocks.push(resumeResult);
        resumeResult = '';
        currentLIMITE = currentLIMITE + LIMITE;
    }}

} catch (err) {
  console.error(err);
}


}
 
  for(let i = 0; i < qtdBlocos ; i++) {
    const block = blockchain.createBlock(newBlocks[i])
    const mineInfo = blockchain.mineBlock(block)
    chain = blockchain.pushBlock(mineInfo.minedBlock)
  }

  //console.log(chain)

 //ESCREVENDO BLOCKCHAIN SAÍDA
 let dataBlockchain : string = '';
 let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
 //let genesis : string = '0;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0000000000000000000000000000000000000000000000000000000000000000;0;00/00/0000 00:00:00';
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

 if(chain.length != 0){
 for (let index = 0; index < qtdBlocos + currentSize; index++) {
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
}

try {
  fs.writeFileSync('src/resumeBlockchain.txt', dataBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

//ESCREVENDO ARQUIVOS JA AUDITADOS NO REGISTRO DE CONTROLE
dataFiles = '';
for (let index = 0; index < filestoResume.length; index++) {
  dataFiles = dataFiles.concat(filestoResume[index]).concat("\r\n");
}

try {
fs.writeFileSync('src/auditados.csv', dataFiles, {flag: 'a+'});
// file written successfully
} catch (err) {
console.error(err);
}

//AUDITORIA DOS RESULTADOS
for (let k = 0; k < currentFiles.length; k++) {

  console.log("AUDITORIA DO ARQUIVO:" + currentFiles[k]);
  
  let resultadoBlockchain;
  let resultado = 'RESULTADO:|';
       
  try {
    const data = fs.readFileSync(currentFiles[k], 'utf8');
    //console.log(data);

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    qtdOpcoes = linhas[0].toString().split('\r\n').length;
    opcoesVoto = linhas[0].split(";", qtdOpcoes);
    qtdVotos = new Array(qtdOpcoes).fill(0);
    //console.log(linhas);
    //console.log(opcoesVoto);
    let vote;
    let j = 0;
    for(let i = 0 ; i < size - 2 ; i++){
      voteData[i] = linhas[i+1];
      vote = voteData[i].split(";", 2);
      for (let j = 0; j < opcoesVoto.length; j++) {
        if(vote[1] == opcoesVoto[j]){
          qtdVotos[j] = qtdVotos[j] + 1;
        }
      }
    }
    //console.log(qtdVotos);

   
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
      var size = data.toString().split('\r\n').length;
      var linhas = data.split("\r\n", size);
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












