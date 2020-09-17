import Joi from "joi";

export const CommentFeedCreateSchema = Joi.object({
  description: Joi.string().min(3).required(),
});

export const CommentFeedUpdateSchema = Joi.object({
  description: Joi.string().min(3).required(),
});
