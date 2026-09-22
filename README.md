# Desafio Afya

API REST desenvolvida em Node.js com TypeScript para gerenciamento de pacientes, consultas e observações clínicas.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Docker
- Joi
- JWT
- Jest

## Como executar

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`.

Suba o PostgreSQL:

```bash
docker compose up -d
```

Execute as migrations:

```bash
npm run migrate
```

Crie o usuário inicial:

```bash
npm run seed
```

Inicie a aplicação:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

## Autenticação

Para realizar login:

```http
POST /login
```

Exemplo:

```json
{
  "email": "user_teste@afya.com",
  "password": "123456"
}
```

As rotas protegidas utilizam JWT:

```text
Authorization: Bearer <token>
```

## Scripts

```bash
npm run dev
npm run build
npm run migrate
npm run seed
npm test
npm run lint
```

## Estrutura

```text
src/
├── config/
├── controllers/
├── database/
├── interfaces/
├── middlewares/
├── repositories/
├── routes/
├── use-cases/
├── app.ts
└── index.ts
```

## Autor

Marcus Silva