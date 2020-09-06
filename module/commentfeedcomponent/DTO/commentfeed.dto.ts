import Joi from "@hapi/joi";

export const GroupCreateSchema = Joi.object({
  description: Joi.string().min(3).required(),
});
