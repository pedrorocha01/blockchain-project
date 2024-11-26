import { BlockChain } from './blockchain'
import { hash} from './hashFunctions'

const fs = require('node:fs');
const path = require ('path');
const pathFile = 'src/files/';

interface Votation {
  nameVotation: String;
  votes: String[];
}
// criando array de objetos de votação
const votation : Votation[] = [];
//criando Objeto
let currentVote : Votation = {nameVotation: '', votes:[]};

// LISTA OS ARQUIVOS NO DIRETORIO
let files = fs.readdirSync(pathFile);
//arquivos atuais no diretorio
let currentFiles: string[] = [];
//blockchains auxiliares já geradas
let blockchainFiles: string[] = [];
//novos arquivos csv dos resultados
let newFiles: string[] = [];
//novas blockchains auxiliares geradas
let newBlockchainFiles: string[] = [];

//ARQUIVOS DE VOTAÇÃO .csv
files.forEach( (file: any) => {
  if (path.extname(file) == ".csv")
    currentFiles.push(pathFile.concat(file));
})

//ARQUIVOS DE BLOCKCHAIN AUXILIAR
files.forEach( (file: any) => {
  if (path.extname(file) == ".txt")
    blockchainFiles.push(pathFile.concat(file));
})

//ADICIONANDO BLOCKCHAINS AUXILIARES EXISTENTES AO ARRAY DE VOTACOES
if(blockchainFiles.length > 0){

    for (let i = 0; i < blockchainFiles.length; i++) {
      var currentFile = blockchainFiles[i].split(".");
      var nameFile = currentFile[0].split("/");
      currentVote.nameVotation = nameFile[2].toString().concat(".txt");;     
      for (let index = 0; index < currentFiles.length; index++) {
        if(currentFiles[index].includes(nameFile[2])){
          currentVote.votes.push(currentFiles[index]);
        }       
      }    
      votation.push(currentVote);
    }
}

//VERIFICANDO QUAIS SAO OS NOVOS ARQUIVOS
for (let i = 0; i < currentFiles.length; i++) {
  if(currentFiles[i] != 'added'){
    var currentFile = currentFiles[i].split(".");
    var currentVotation = currentFile[0].split("_");
    //let currentVote : Votation = {nameVotation: '', votes:[]};
    
    currentVote.nameVotation = currentVotation[1].toString().concat(".txt");
    currentVote.votes.push(currentFiles[i]);
    for (let index = 0; index < currentFiles.length; index++) {
      if(currentFiles[index].includes(currentVotation[1])){
        currentVote.votes.push(currentFiles[index]);
        currentFiles[index] = 'added';
      }       
    }   
    votation.push(currentVote);
  }
}
  
// VARIAVEL DE CONTROLE DE CRIAÇÃO DE BLOKCHAIN
var MODE = "new";
//PROPRIEDADES BLOCKCHAIN DE VOTOS
let voteData: string[] = [];
let opcoesVoto: String[] = [];
let qtdVotos: string[] = [];
let qtdOpcoes;
var qtdVotantes;
var changePath: string[] = [];


//CRIAÇÃO DAS BLOCKCHAINS TEMPORÁRIAS
for (let k = 0; k < votation.length; k++) {

  for (let index = 0; index < votation[k].votes.length; index++) {

    try {
      const data = fs.readFileSync(votation[k].votes[index], 'utf8');
    
        var size = data.toString().split('\r\n').length;
        var linhas = data.split("\r\n", size);
        voteData[index] = linhas[3];
        console.log(linhas[3]);
       
    } catch (err) {
      console.error(err);
    }

    //let newPath = "src/autitingFiles";
    //let newPathFile = newPath.concat(votation[k].votes[index].toString());
    changePath.push(votation[k].votes[index].toString());
    
  }

//LENDO BLOCKCHAIN AUXILIAR EXISTENTE
let dataResume: string = '';
let sizeBlockMain: number = 0;
let contentLastBlock: string = 'empty';
let lastSequence: number = 0;

let fileVotation = (votation[k].nameVotation).toString();
if(blockchainFiles.includes(fileVotation)){

    try {
      const data = fs.readFileSync(fileVotation, 'utf8');
      
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
}

// DEFININDO MODO DE CRIAÇÃO DE BLOCKCHAIN AUXILIAR
if(contentLastBlock != 'empty'){
  MODE = 'add';
}
// CRIANDO BLOCKCHAIN TEMPORÁRIA
const newBlockchain = new BlockChain(Number(4), MODE, contentLastBlock, lastSequence)
let newChain = newBlockchain.chain
//const newBlockchain = new BlockChain(Number(4), MODE, '', 0)
//let newChain = newBlockchain.chain

for(let i = 0; i < votation[k].votes.length; i++) {
  const newblock = newBlockchain.createBlock(voteData[i])
  const mineInfo = newBlockchain.mineBlock(newblock)
  newChain = newBlockchain.pushBlock(mineInfo.minedBlock)
}

let dataVoteBlockchain: string = ''

try {

       //escrevendo blockchain saída
       let dataBlockchain : string = '';
       let title: string = 'Number;BlockHash;Previous_BlockHash;Content_Hash;Nonce;TimeStamp';
       let inicio : number = 1;
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
       let _data : any;
       let _previousHah :string;
       let line: string = '';
 
       if(newChain.length != 0){
            for (let index = inicio; index < votation[k].votes.length; index++) {
            line = '';
            _nonce = newChain[index].header.nonce.toString();
            _blockHash = newChain[index].header.blockHash;
            _sequence = newChain[index].payload.sequence.toString();
            if(MODE == 'add' && _sequence == '1'){
              _sequence = (Number(_sequence) + sizeBlockMain).toString();
              sizeBlockMain = Number(_sequence);
            }
            _timestamp = newChain[index].payload.timestamp.toString();
            _data = newChain[index].payload.data;
            _data = _data.replace(";", ":");
            _previousHah = newChain[index].payload.previousHash;
            line = line.concat(_sequence, ";", _blockHash, ";", _previousHah, ";", _data, ";", _nonce, ";", _timestamp);
            dataBlockchain = dataBlockchain.concat(line, "\r\n");
            }
      }
 
      dataVoteBlockchain = dataBlockchain;
      fileVotation = "src/files/".concat(fileVotation);

      newBlockchainFiles.push(fileVotation);
  
  fs.writeFileSync(fileVotation, dataVoteBlockchain);
  // file written successfully
} catch (err) {
  console.error(err);
}

}

let tamCurrentBlockchain;
let maxTamBlockchain;
//AUDITORIA DOS ARQUIVOS
for (let k = 0; k < votation[k].votes.length; k++) {



let auditingFile : string[] = [];
let auditingBlockchain : string[] = [];

for (let index = 0; index < votation[k].votes.length; index++) {
  console.log("AUDITORIA DO ARQUIVO:" + votation[k].votes[index]);

  try {
    const data = fs.readFileSync(votation[k].votes[index], 'utf8');
  
      var size = data.toString().split('\r\n').length;
      var linhas = data.split("\r\n", size);
      tamCurrentBlockchain = size - 3;
      maxTamBlockchain = linhas[1];
      for(let i = 0 ; i < size - 1 ; i++){
        auditingFile[i] = linhas[2].replace(";", ":");;
      }
  
  
  } catch (err) {
    console.error(err);
  }
  
}

let resultFile = '';
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

//SE A BLOCKCHAIN ATINGIU O TAMANHO O RESULTADO SERÁ CALCULADO
if((tamCurrentBlockchain) == maxTamBlockchain){

  let resultados: string[] = [];
  try {
    const data = fs.readFileSync(newBlockchainFiles[k], 'utf8');
  
      var size = data.toString().split('\r\n').length;
      var linhas = data.split("\r\n", size);
      qtdVotantes = size - 3;
      //qtdOpcoes = linhas[0].toString().split(';').length;
      //opcoesVoto = linhas[0].split(";", qtdOpcoes);
      qtdVotos = new Array(qtdOpcoes).fill(0);
  
      let vote;
      let counter : String[] = [];
      for(let i = 2 ; i < qtdVotantes + 2; i++){
        var arrayVote = linhas[i].split(";");
        resultFile = resultFile + arrayVote[3] + "\r\n";
        vote = arrayVote[3].split(":", 2);
        counter.push(vote);
        if(!(opcoesVoto.includes(vote))){
          opcoesVoto.push(vote);
        }
      }

      let options = '';
      //contando os votos
      for (let i = 0; i < opcoesVoto.length; i++) {
        options = options + opcoesVoto[i] + ";";
        for (let j = 0; j < counter.length; j++) {
          if(counter[j] == opcoesVoto[i]){
            qtdVotos[i] = qtdVotos[i] + 1;
          }         
        }
      }

      resultFile = options + "\r\n" + resultFile;
  
  
  } catch (err) {
    console.error(err);
  }

  let resultado = 'RESULTADO: |';
  for (let j = 0; j < qtdVotos.length; j++) {
    resultFile = resultado.concat(opcoesVoto[j].toString()).concat(":").concat(qtdVotos[j]).concat("|");
  }
  //resultados[k] = resultado;
  let nameFile = (votation[k].nameVotation).toString().split(".");
  let newFile = nameFile[0].concat(".csv")
  newFiles.push(newFile);

  try {
    fs.writeFileSync(newFile, "\r\n".concat(resultFile), {flag: 'a+'});  
  } catch (err) {
  console.error(err);
  }

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


//TROCAR OS ARQUIVOS DE DIRETORIO
for (let index = 0; index < changePath.length; index++) {
  let pastaDestino = 'src/auditingFiles';
  let arquivoDestino = path.join(pastaDestino, changePath[index]);
  fs.rename(changePath[index], arquivoDestino, (erro: Error) =>{
    if(erro){
        console.error('Erro ao mover arquivo: ${erro}');
    }else{
        //sucesso
    }
    
  });
}


//COLOCAR ARQUIVOS DE VOTOS EM AUDITING FILES APÓS AUDITADOS
// COLOCAR ARQUIVO DE RESULTADO EM RESULT FILES

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

  //LENDO ARQUIVOS DE RESULT FILES ORGANIZADOS EM SEQUENCIA POR auditados.csv
if(auditingFiles.length > 0){
for (let k = 0; k < auditingFiles.length; k++) {

  let fail = 0;
  console.log("AUDITORIA DO ARQUIVO:" + auditingFiles[k]);

  try {
    let pathResult = 'src/resultFiles/';
    pathResult = pathResult.concat(auditingFiles[k]);
    let data = fs.readFileSync(pathResult, 'utf8');

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
}
