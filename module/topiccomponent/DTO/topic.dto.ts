import Joi from "joi";

export const TopicCreateSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
});

export const TopicUpdateSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
});

