# Documentação do Banco de Dados

# Banco de Dados

O projeto utiliza PostgreSQL como banco de dados relacional.

## Diagrama

```mermaid
erDiagram
    USERS ||--o{ APPOINTMENTS : schedules
    PATIENTS ||--o{ APPOINTMENTS : has
    APPOINTMENTS ||--o{ CONSULTATION_NOTES : contains

    USERS {
        UUID id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR password_hash
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    PATIENTS {
        UUID id PK
        VARCHAR name
        VARCHAR phone
        VARCHAR email
        DATE birth_date
        VARCHAR gender
        INTEGER height
        INTEGER weight
        TIMESTAMP deleted_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    APPOINTMENTS {
        UUID id PK
        UUID user_id FK
        UUID patient_id FK
        TIMESTAMP scheduled_at
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    CONSULTATION_NOTES {
        UUID id PK
        UUID appointment_id FK
        TEXT description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

## Relacionamentos

- `users` → `appointments`: um usuário pode possuir várias consultas agendadas.
- `patients` → `appointments`: um paciente pode possuir várias consultas.
- `appointments` → `consultation_notes`: uma consulta pode possuir várias observações.

## Regras importantes

A combinação de `user_id` e `scheduled_at` em `appointments` é única, impedindo que o mesmo usuário responsável tenha mais de um paciente agendado no mesmo horário.

A exclusão de pacientes é lógica. O campo `deleted_at` identifica pacientes removidos e os dados pessoais são anonimizados, preservando os relacionamentos necessários para o histórico de consultas.

As medidas são armazenadas como valores inteiros:

- `height`: altura em centímetros.
- `weight`: peso em gramas.