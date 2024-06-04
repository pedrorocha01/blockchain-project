# Blockchain TypeScript

> 🇧🇷 Implementação de blockchain em TypeScript.

## Descrição

Características atuais:

- Executa em um único nó
- Pode ser usado para criar uma nova blockchain
- Pode ser usado para adicionar novos blocos a uma blockchain existente
- Pode ser usado para verificar a validade de um bloco
- Os blocos suportam quaisquer dados em seus `payloads`

Características futuras:

- Salvar e ler a blockchain em um arquivo
- Adicionar suporte a transações
- Adicionar suporte a ramificações
- Adicionar suporte a tokens
- Rede distribuída
- Consenso distribuído
- Transações distribuídas
- Mineração distribuída

## Instalação

```bash
npm i
```

## Uso

É preciso dois parâmetro opcionais que são:

- a dificuldade do processo de mineração. O padrão é `4`.
- o número de blocos a minerar. O padrão é `10`.

```bash
npm start [dificuldade = 4] [númeroDeBlocos = 10]
```

## Tarefas de um futuro próximo

- [ ] Rede distribuída
- [ ] Refatorar para tornar os blocos uma classe em vez de uma interface para que possa ter métodos internos para calcular hashes e nonces
- [ ] Adicionar um pequeno frontend para visualizar a blockchain como um gráfico
