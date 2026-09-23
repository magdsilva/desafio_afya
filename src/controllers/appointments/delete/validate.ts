import Joi from 'joi'

const appointmentIdSchema = Joi.string()
  .uuid()
  .required()

const validateAppointmentId = (id: unknown) => {
  return appointmentIdSchema.validate(id)
}

export { validateAppointmentId }