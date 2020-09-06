import Joi from "joi";

export const CommentPostCreateSchema = Joi.object({
  description: Joi.string().min(3).required(),
});

export const CommentPostUpdateSchema = Joi.object({
  description: Joi.string().min(3).required(),
});
