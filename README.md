# Desafio Afya

API REST desenvolvida em Node.js com TypeScript para gerenciamento de prontuários, pacientes e consultas médicas.

A aplicação permite cadastrar e gerenciar pacientes, realizar agendamentos, registrar observações durante consultas e consultar o histórico de atendimentos.

O projeto foi desenvolvido como parte do desafio técnico da Afya, priorizando organização em camadas, validação dos dados, autenticação, testes, documentação da API e deploy em ambiente cloud.

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
- GitHub Actions
- Render

## Funcionalidades

A API disponibiliza:

- autenticação utilizando JWT;
- cadastro, consulta e atualização de pacientes;
- exclusão lógica e anonimização de pacientes;
- agendamento de consultas;
- validação de conflito de horários na agenda;
- listagem, atualização e exclusão de consultas;
- registro de observações durante uma consulta;
- histórico de consultas e observações do paciente;
- preservação do histórico de atendimentos após a anonimização do paciente.

## Arquitetura

O projeto foi organizado em camadas, separando responsabilidades entre entrada HTTP, regras de negócio e acesso aos dados.

```text
src/
├── config/          # Configurações da aplicação e banco
├── controllers/     # Entrada e saída das requisições HTTP
├── database/        # Migrations, seed e configuração do banco
├── docs/            # Documentação Swagger e diagrama do banco
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

Para executar o projeto localmente é necessário ter instalado:

- Node.js
- npm
- Docker
- Docker Compose

## Como executar

Clone o repositório e instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` utilizando `.env.example` como referência:

```bash
cp .env.example .env
```

Preencha as variáveis de ambiente conforme necessário para o ambiente local.

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
https://localhost:3000
```

## Deploy

A aplicação está hospedada no Render, utilizando um Web Service para a API e PostgreSQL gerenciado para persistência dos dados.

### Ambiente publicado

- API: https://desafio-afya-api-zjwb.onrender.com
- Swagger: https://desafio-afya-api-zjwb.onrender.com/docs

### Arquitetura em cloud

```text
GitHub
   │
   │ push/merge na main
   ▼
Render Web Service
   │
   │ Node.js / Express
   ▼
Render PostgreSQL
```

O Render está integrado ao repositório e realiza automaticamente um novo deploy após alterações na branch `main`.

As configurações sensíveis do ambiente, como credenciais do banco de dados e chave JWT, são definidas através de variáveis de ambiente e não são versionadas no repositório.

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

As demais rotas protegidas devem enviar o token no header:

```text
Authorization: Bearer <token>
```

## Documentação da API

A documentação OpenAPI/Swagger está disponível no ambiente publicado:

```text
https://desafio-afya-api-zjwb.onrender.com/docs
```

Para execução local:

```text
http://localhost:3000/docs
```

A interface permite consultar os endpoints, parâmetros, exemplos de requisição e respostas, além de executar chamadas diretamente pelo navegador.

## Banco de dados

O projeto utiliza PostgreSQL como banco de dados relacional.

No ambiente local, o PostgreSQL 16 é executado através do Docker Compose. No ambiente publicado, a aplicação utiliza uma instância PostgreSQL gerenciada pelo Render.

As migrations são executadas em ordem e registradas no banco para evitar execuções duplicadas.

O diagrama e a descrição da modelagem estão disponíveis em:

```text
src/docs/database.md
```

A exclusão de pacientes utiliza exclusão lógica e anonimização dos dados pessoais. O histórico de consultas e observações permanece preservado e pode continuar sendo consultado após a anonimização.

A agenda também possui uma restrição de unicidade por usuário e horário, evitando o agendamento de mais de um paciente no mesmo horário.

## Testes

Os testes unitários foram implementados utilizando Jest.

Para executar:

```bash
npm test
```

Para executar os testes e gerar o relatório de cobertura:

```bash
npm run test:coverage
```

## Qualidade de código

O projeto utiliza ESLint para análise estática do código.

```bash
npm run lint
```

Para aplicar automaticamente as correções disponíveis:

```bash
npm run lint:fix
```

## CI/CD

O projeto utiliza GitHub Actions para integração contínua, executando automaticamente verificações de qualidade em pushes e pull requests direcionados à branch `main`.

O pipeline executa:

- instalação das dependências;
- build da aplicação;
- lint;
- testes automatizados.

Após alterações na branch `main`, o Render realiza automaticamente o deploy da aplicação, mantendo o ambiente publicado atualizado.

O fluxo de CI/CD pode ser representado por:

```text
Feature Branch
      │
      ▼
Pull Request
      │
      ▼
GitHub Actions
      │
      ├── Build
      ├── Lint
      └── Tests
      │
      ▼
Merge na main
      │
      ▼
Render
      │
      ▼
Deploy automático
```

O workflow de integração contínua está disponível em:

```text
.github/workflows/ci.yml
```

## Scripts

```bash
npm run dev            # Executa a aplicação em desenvolvimento
npm run build          # Compila o TypeScript
npm start              # Executa a versão compilada
npm run migrate        # Executa as migrations
npm run seed           # Cria o usuário inicial
npm test               # Executa os testes
npm run test:coverage  # Executa os testes e gera o relatório de cobertura
npm run lint           # Executa o ESLint
npm run lint:fix       # Executa o ESLint aplicando correções automáticas
```

## Autor

Marcus Antônio G Silva
