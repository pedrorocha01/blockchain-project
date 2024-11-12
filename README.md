# Sistema de auditoria de votação baseado em tecnologia blockchain

- Arquivos de votação: arquivos que contém as opções de voto, a identificação do votante e os votos.

- Votantes: entidade identificada por um número que pode ser um documento ou outro código único intransferível.

- Blockchains Auxiliares: blockchains que serão criadas para representar um voto em cada bloco, e usadas como parâmetro de confiança para auditoria dos arquivos de votação.

- Blockchain Principal: blockchain que vai guardar os blocos resumidos.

Objetivo: Validar e auditar os votos em blockchains auxiliares, armazenar os resultados de forma que reduza um número n de blocos, para apenas 1 bloco que carrega em uma hash a informação correspondente a esses n blocos e adicioná-lo a blockchain principal que guarda o histórico de todas as votações realizadas. Otimizar o armazenamento mantendo a camada de proteção criptográfica. 

- Um nova votação é representada por um arquivo que contém em sua primeira linha as opções diponíveis e nas demais linhas a identificação do votante e seu voto.
- Estes arquivos estarão armazenados em um diretório específico.
- Quando um novo arquivo é inserido no diretório, a aplicação vai verificar se aquele arquivo já possui uma blockchain auxiliar que respresente seus votos, se não, vai gerar essa blockchain e apurar os votos escrevendo o resultado no arquivo de votação, e após finalizada vai fazer verificações voto a voto paraverificar se houve adulteração.
- Após a auditoria voto a voto, apenas o resultado da votação e uma hash do arquivo de votação vão se tornar os dados de um  único bloco que será inserido na blockchain principal e conectado ao restante da cadeia formando assim um histórico de todas as votações.
- A partir da blockchain principal, os arquivos de votação podem ser frequentemente revisitados através de uma auditoria que compara a hash e o resultado atestando se houve adulterações, e caso aconteça, o resultado válido está na blockchain principal.


## Instalação

```bash
npm i
```

## Uso

Parâmetros:

- a dificuldade do processo de mineração. O padrão é `4`.
- o número de blocos inseridos na blockchain principal. O padrão é `1`.

```bash
npm start [dificuldade = 4] [númeroDeBlocos = 1]
```

