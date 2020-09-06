import * as Joi from "joi";

exports.getAllByUser = async (data: any) => {
  const schema = Joi.object().keys({
    user: Joi.string().required,
    page: Joi.number(),
    pageSize: Joi.number(),
  });

  const { value, error } = Joi.validate(data, schema);
  if (error && error.details) {
    return { error };
  }
};
