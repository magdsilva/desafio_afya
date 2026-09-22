import Joi from 'joi'

const patientIdSchema = Joi.string()
  .uuid()
  .required()

const validatePatientId = (id: unknown) => {
  return patientIdSchema.validate(id)
}

export { validatePatientId }