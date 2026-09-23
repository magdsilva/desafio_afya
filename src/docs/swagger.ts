import swaggerJsdoc from 'swagger-jsdoc'

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Desafio Afya API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de pacientes e consultas'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string'
            },
            phone: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            birthDate: {
              type: 'string',
              format: 'date'
            },
            gender: {
              type: 'string'
            },
            heightCm: {
              type: 'integer',
              example: 175
            },
            weightGrams: {
              type: 'integer',
              example: 75000
            }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            userId: {
              type: 'string',
              format: 'uuid'
            },
            patientId: {
              type: 'string',
              format: 'uuid'
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2026-09-29'
            },
            time: {
              type: 'string',
              example: '15:00'
            },
            status: {
              type: 'string',
              example: 'SCHEDULED'
            }
          }
        },
        ConsultationNote: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            appointmentId: {
              type: 'string',
              format: 'uuid'
            },
            description: {
              type: 'string'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/docs/paths/*.ts'
  ]
})

export { swaggerSpec }