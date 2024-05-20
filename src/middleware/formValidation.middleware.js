"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const responseFunction_1 = require("../utils/functions/responseFunction");
const formValidationMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const bodyRequest = req.file ? Object.assign({ [req.file.fieldname]: req.file }, req.body) : req.body;
            const validateData = schema.parse(bodyRequest);
            req.body = validateData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json((0, responseFunction_1.payloadValidationResponse)(error));
            }
            else {
                console.error('Error validating request:', error);
                return res.status(500).json((0, responseFunction_1.serverErrorResponse)());
            }
        }
    };
};
exports.default = formValidationMiddleware;
