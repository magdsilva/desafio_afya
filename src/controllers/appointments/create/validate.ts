import Joi from 'joi'

const schema = Joi.object({
  patientId: Joi.string()
    .uuid()
    .required(),

  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
})

const validate = (data: unknown) => {
  return schema.validate(data)
}

export { validate }