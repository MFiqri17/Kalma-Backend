/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { payloadValidationResponse, serverErrorResponse } from '../utils/functions/responseFunction';

const formValidationMiddleware = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyRequest = req.file ? { [req.file.fieldname]: req.file, ...req.body } : req.body;
      const validateData = schema.parse(bodyRequest);
      req.body = validateData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(payloadValidationResponse(error));
      } else {
        console.error('Error validating request:', error);
        return res.status(500).json(serverErrorResponse());
      }
    }
  };
};

export default formValidationMiddleware;
