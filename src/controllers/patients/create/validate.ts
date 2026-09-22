import Joi from 'joi'

const createPatientSchema = Joi.object({
  name: Joi.string()
    .max(150)
    .required(),

  phone: Joi.string()
    .max(30)
    .required(),

  email: Joi.string()
    .email()
    .max(255)
    .required(),

  birthDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),

  gender: Joi.string()
    .max(20)
    .required(),

  heightCm: Joi.number()
    .integer()
    .positive()
    .required(),

  weightGrams: Joi.number()
    .integer()
    .positive()
    .required()
})

export const validate = (data: unknown) => {
  return createPatientSchema.validate(data)
}
