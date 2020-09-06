import Joi from "joi";

export const PostCreateSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
});
