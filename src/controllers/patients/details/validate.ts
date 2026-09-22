import Joi from 'joi'

const patientIdSchema = Joi.string()
  .uuid()
  .required()

export const validatePatientId = (id: unknown) => {
  return patientIdSchema.validate(id)
}
