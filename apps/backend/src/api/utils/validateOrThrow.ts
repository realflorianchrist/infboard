import {ZodError, ZodSchema} from "zod";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import {ErrorType} from "@workspace/types/apiResponses";
import {ValidationErrorType} from "@workspace/types/modelValidation";

export const validateOrThrow = <T>(schema: ZodSchema<T>, data: unknown): T => {
    try {
        return schema.parse(data);
    } catch (err) {
        if (err instanceof ZodError) {
            throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                validationErrors: err.errors.map((e) => e.message as ValidationErrorType),
            });
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
    }
}
