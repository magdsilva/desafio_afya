# Desafio Afya

Este é um projeto de desafio técnico.

## Estrutura do Projeto

```
src/
├── config/           # Configurações da aplicação
├── controllers/      # Controllers das rotas
├── enums/            # Enumerações
├── helpers/          # Funções auxiliares
├── interfaces/       # Interfaces TypeScript
├── middlewares/      # Middlewares Express
├── repositories/     # Acesso a dados
├── routes/           # Definição de rotas
├── use-cases/        # Casos de uso (lógica de negócio)
├── utils/            # Utilitários
├── database/
│   ├── migrations/   # Migrations do banco
│   └── connection.ts # Configuração de conexão
├── app.ts            # Configuração do Express
└── index.ts          # Ponto de entrada
```

## Como Começar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente: copie `.env.example` para `.env`
4. Inicie o servidor: `npm run dev`

## Testes

```bash
npm test
```

## Build

```bash
npm run build
```
