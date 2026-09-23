# Desafio Afya

API REST desenvolvida em Node.js com TypeScript para gerenciamento de prontuários, pacientes e consultas médicas.

A aplicação permite cadastrar e gerenciar pacientes, realizar agendamentos, registrar observações durante consultas e consultar o histórico de atendimentos.

O projeto foi desenvolvido como parte do desafio técnico da Afya, priorizando organização em camadas, validação dos dados, autenticação, testes e documentação da API.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Docker / Docker Compose
- Joi
- JWT
- Jest
- Swagger / OpenAPI
- ESLint

## Funcionalidades

A API disponibiliza:

- autenticação utilizando JWT;
- cadastro, consulta e atualização de pacientes;
- exclusão lógica e anonimização de pacientes;
- agendamento de consultas;
- validação de conflito de horários na agenda;
- listagem, atualização e exclusão de consultas;
- registro de observações durante uma consulta;
- histórico de consultas do paciente.

## Arquitetura

O projeto foi organizado em camadas, separando responsabilidades entre entrada HTTP, regras de negócio e acesso aos dados.

```text
src/
├── config/          # Configurações da aplicação e banco
├── controllers/     # Entrada e saída das requisições HTTP
├── database/        # Migrations, seed e configuração do banco
├── docs/            # Configuração e documentação Swagger
├── helpers/         # Funções auxiliares
├── interfaces/      # Interfaces TypeScript
├── middlewares/     # Autenticação e tratamento de erros
├── repositories/    # Acesso ao PostgreSQL
├── routes/          # Definição das rotas REST
├── use-cases/       # Regras de negócio
├── app.ts
└── index.ts
```

O fluxo principal das requisições é:

```text
HTTP → Routes → Middlewares → Controllers → Use Cases → Repositories → PostgreSQL
```

## Pré-requisitos

Para executar o projeto é necessário ter instalado:

- Node.js
- npm
- Docker
- Docker Compose

## Como executar

Clone o repositório e instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` utilizando `.env.example` como referência.

Exemplo para execução local:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=desafio_afya
DATABASE_USER=msilva_afya
DATABASE_PASSWORD=msilva_afya_pass

SEED_USER_NAME=Usuário Para Testes
SEED_USER_EMAIL=user_teste@afya.com
SEED_USER_PASSWORD=123456

JWT_SECRET=defina-uma-chave-secreta
JWT_EXPIRES_IN=1h
```

Suba o PostgreSQL utilizando Docker:

```bash
docker compose up -d
```

Execute as migrations:

```bash
npm run migrate
```

Crie o usuário inicial utilizado para autenticação:

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

Para obter o token JWT:

```http
POST /login
```

Exemplo de requisição:

```json
{
  "email": "user_teste@afya.com",
  "password": "123456"
}
```

As demais rotas protegidas devem enviar o token:

```text
Authorization: Bearer <token>
```

## Documentação da API

Com a aplicação em execução, a documentação OpenAPI/Swagger pode ser acessada em:

```text
http://localhost:3000/docs
```

A interface permite consultar os endpoints, parâmetros, exemplos de requisição e respostas, além de executar chamadas diretamente pelo navegador.

## Banco de dados

O projeto utiliza PostgreSQL 16 executado através do Docker Compose.

As migrations são executadas em ordem e registradas no banco para evitar execuções duplicadas.

O diagrama e a descrição da modelagem estão disponíveis em:

```text
docs/database.md
```

A exclusão de pacientes utiliza exclusão lógica e anonimização dos dados pessoais, mantendo os relacionamentos necessários para preservar o histórico de consultas.

## Testes

Os testes unitários foram implementados utilizando Jest.

Para executar:

```bash
npm test
```

Para executar em modo watch:

```bash
npm run test:watch
```

## Scripts

```bash
npm run dev        # Executa a aplicação em desenvolvimento
npm run build      # Compila o TypeScript
npm start          # Executa a versão compilada
npm run migrate    # Executa as migrations
npm run seed       # Cria o usuário inicial
npm test           # Executa os testes
npm run test:watch # Executa os testes em modo watch
npm run lint       # Executa o ESLint
```

## Autor

Marcus Antônio G Silva