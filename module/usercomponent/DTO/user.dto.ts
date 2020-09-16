import Joi from "joi";

export const UserCreateSchema = Joi.object({
  email: Joi.string().email().min(10).required(),
  password: Joi.string().min(8).required(),
  display_name: Joi.string().min(1).required(),
  gender: Joi.string().required(),
  role: Joi.string(),
});

export const UserLoginSchema = Joi.object({
  email: Joi.string().email().min(10).required(),
  password: Joi.string().min(8).required(),
});

export const UserChangeSchema = Joi.object({
  oldpassword: Joi.string().min(8).required(),
  newpassword: Joi.string().min(8).required(),
  renewpassword: Joi.string().min(8).required(),
});
