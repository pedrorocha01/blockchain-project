/*

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
})

var opcaoEscolhida;
var titulo;
var qtdopcoes;
var opcoes: string[] = [];
var qtVotantes;
var voto;
var id;
var arquivoEscolhido;

function callOptions(newFiles: string[]): void{
    rl.question('Olá bem vindo!\n Escolha a opção desejada:\n 1- Criar nova votação\n'+
        '2-Adicionar um voto\n3-Realizar Auditoria\n4-Sair\n',
          (opcao: number) =>{
              opcaoEscolhida = opcao;
              if(opcaoEscolhida == 1){
                rl.question('Qual o título da nova votação?\n', (op: string) => {
                    titulo = op;
                    rl.question('Qual a quantidade de votantes?\n', (op: number) => {
                        qtVotantes = op;
                        rl.question('Quantas serão as opções?\n', (op: number) => {
                          qtdopcoes = op;
                          opcoes = readOptions(qtdopcoes, 1);
                          callOptions(newFiles);
                      })
                    })                   
                })

              }else  if(opcaoEscolhida == 2){                
                 rl.question('Digite sua identificação(CPF/IDENTIDADE):\n', (op: string) => {
                    id = op;                                         
                    showVotations(newFiles, id); 
                 })
              }else  if(opcaoEscolhida == 3){
                    // executar index.ts
                callOptions(newFiles);
              }else  if(opcaoEscolhida == 4){
                rl.close();
              }
          })
}

function readOptions(qtdOpcoes: number, index: number) : string[]{
      rl.question('Qual a opção ' + index +'?\n', (op: string) => {
          opcoes.push(op);
          if(qtdOpcoes == 1){
            callOptions(newFiles);
          }
          readOptions(qtdOpcoes - 1, index + 1);
      })
    return opcoes;
}

function showVotations(newFiles :string[] , id: string) {
  console.log("Em qual votação deseja inserir um voto?\n");
  for (let index = 1; index < newFiles.length + 1; index++) {
    console.log(index + '- ' + newFiles[index-1] + '\n');
  }
  rl.question('Digite o número da opção escolhida:\n', (op: number) => { 
    arquivoEscolhido = op;
    showOptions(newFiles[arquivoEscolhido - 1], id);
})
}

function showOptions(arquivo: string , id: string) {
  //le primeira linha do arquivo
  try {
    const data = fs.readFileSync(arquivo, 'utf8');

    var size = data.toString().split('\r\n').length;
    var linhas = data.split("\r\n", size);
    
  } catch (error) {
      console.log(error);
  }
  
  rl.question('Digite a opção escolhida:\n'+ linhas[0] + '\n', (op: string) => {    
    voto = op;
    writeVote(voto, arquivo, id);
}) 
}

function writeVote(voto :string, arquivo :string, id: string){
  let data = '';
  data = data.concat(id, ';', voto, '\r\n');
  try {
    fs.writeFileSync(arquivo, dataFiles, {flag: 'a+'});
    console.log('Voto registrado!');
    callOptions(newFiles);
  } catch (err) {
  console.error(err);
  }
}

callOptions(newFiles);

*/
