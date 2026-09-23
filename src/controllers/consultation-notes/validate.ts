import Joi from 'joi'

const schema = Joi.object({
  description: Joi.string()
    .trim()
    .min(1)
    .required()
})

const appointmentIdSchema = Joi.string()
  .uuid()
  .required()

const validate = (data: unknown) => {
  return schema.validate(data)
}

const validateAppointmentId = (id: unknown) => {
  return appointmentIdSchema.validate(id)
}

export {
  validate,
  validateAppointmentId
}