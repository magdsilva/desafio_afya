import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string()
    .max(150),

  phone: Joi.string()
    .max(30),

  email: Joi.string()
    .email()
    .max(255),

  birthDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/),

  gender: Joi.string()
    .max(20),

  heightCm: Joi.number()
    .integer()
    .positive(),

  weightGrams: Joi.number()
    .integer()
    .positive()
}).min(1)

const patientIdSchema = Joi.string()
  .uuid()
  .required()

const validate = (data: unknown) => {
  return schema.validate(data)
}

const validatePatientId = (id: unknown) => {
  return patientIdSchema.validate(id)
}

export {
  validate,
  validatePatientId
}