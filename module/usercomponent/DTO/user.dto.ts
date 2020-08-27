import Joi from "@hapi/joi";

export const UserCreateSchema = Joi.object({
  email: Joi.string().email().min(10).required(),
  password: Joi.string().min(6).required(),
  display_name: Joi.string().min(1).required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
});

export const UserLoginSchema = Joi.object({
  email: Joi.string().email().min(10).required(),
  password: Joi.string().min(6).required()
})
