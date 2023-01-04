import joi from "joi";

const subscribeSchema = joi
  .object({ endpoint: joi.string().uri() })
  .unknown(true);

export { subscribeSchema };
