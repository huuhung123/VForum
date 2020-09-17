import Joi from "joi";

export const FeedCreateSchema = Joi.object({
  attachments: Joi.array(),
  description: Joi.string().min(3).required(),
});

export const FeedUpdateSchema = Joi.object({
  attachments: Joi.array(),
  description: Joi.string().min(3).required(),
});
