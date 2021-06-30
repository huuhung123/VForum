import Joi from "joi";

export const WalletCreateSchema = Joi.object({
  type: Joi.string().required(),
  amount: Joi.number().min(0).required(),
});

export const WalletUpdateSchema = Joi.object({
  type: Joi.string().required(),
  amount: Joi.number().min(0).required(),
});

