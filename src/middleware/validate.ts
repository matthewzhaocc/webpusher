import express from "express";
import joi from "joi";

const validate = (schema: joi.ObjectSchema) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const response = schema.validate(req.body);
    if (response.error) {
      res.status(400).send(response.error);
      return;
    }

    next();
  };
};

export default validate;
