import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware(
  type: any,
  skipMissingProperties = false,
  forbidNonWhitelisted = true,
  forbidUnknownValues = true,
  whitelist = true
): RequestHandler {
  return (req, res, next) => {
    let { body } = req;
    if (req.method === 'GET') {
      body = req.query;
    }

    validate(plainToClass(type, body), {
      skipMissingProperties,
      forbidNonWhitelisted,
      forbidUnknownValues,
      whitelist,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(', ');
        next(new HttpException(400, 30002, message));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
