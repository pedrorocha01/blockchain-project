# Votação confiável baseada em auditoria e redução de blocos em blockchain

- Arquivos de voto: arquivos que contém a votação correspondente, opções de voto, a identificação do votante e os votos.

- Votantes: entidade identificada por um número que pode ser um documento ou outro código único intransferível.

- Blockchains temporárias: blockchains que serão criadas para representar um voto em cada bloco, e usadas como parâmetro de confiança para auditoria dos arquivos de votação.

- Arquivos de votação: arquivos gerados após a auditoria dos arquivos de voto pela blockchain temporária correspondente.

- Blockchain permanente: blockchain que vai guardar os blocos resumidos.

Objetivo: Validar e auditar os votos em blockchains temporárias, armazenar os resultados de forma que reduza um número n de blocos, para apenas 1 bloco. Esse bloco carrega em uma hash a informação correspondente a esses n blocos e é adicionado a blockchain permanente que guarda o histórico de todas as votações realizadas. Otimizar o armazenamento mantendo a camada de proteção criptográfica. 

- Um arquivo de votação é representada por um arquivo que contém em sua primeira linha as opções diponíveis e nas demais linhas a identificação do votante e seu voto, e no final o resultado calculado através da blockchain temporária.
- Quando um novo arquivo de voto é inserido no diretório, a aplicação vai verificar se aquele arquivo já possui uma blockchain temporária que respresente seus votos, se não, vai gerar essa blockchain e apurar os votos, fazendo uma auditoria entre os blocos gerados e os arquivos de voto.
- Após a auditoria voto a voto, apenas o resultado da votação e uma hash do arquivo de votação vão se tornar os dados de um  único bloco que será inserido na blockchain permanente e conectado ao restante da cadeia formando assim um histórico de todas as votações.
- A partir da blockchain permanente, os arquivos de votação podem ser frequentemente revisitados através de uma auditoria que compara a hash e o resultado atestando se houve adulterações, e caso aconteça, o resultado válido está na blockchain permanente.


## Instalação

```bash
npm i
```

## Uso

Parâmetros:

- a dificuldade do processo de mineração. O padrão é `4`.
- o número de blocos inseridos na blockchain PERMANENTE. O padrão é `1`.

```bash
npm start [dificuldade = 4] [númeroDeBlocos = 1]
```

