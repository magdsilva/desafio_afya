import Joi from 'joi'

const schema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/),

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/),

  status: Joi.string()
    .valid('SCHEDULED', 'COMPLETED', 'CANCELED')
}).min(1)

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