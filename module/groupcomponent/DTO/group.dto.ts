import Joi from "joi";

export const GroupCreateSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

export const GroupUpdateSchema = Joi.object({
  name: Joi.string().min(3).required(),
})