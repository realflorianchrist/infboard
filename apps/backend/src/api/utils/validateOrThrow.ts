import {ZodError, ZodSchema} from "zod";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import {ErrorType, ValidationErrorType} from "@workspace/types";


/**
 * Validates input data against a Zod schema and either returns the parsed value
 * or throws a standardized API error.
 *
 * Behavior:
 * - Uses `schema.parse(...)` to validate and transform the input.
 * - On validation failure, converts Zod issues into API-friendly error messages.
 * - Wraps validation errors in an {@link ApiError} with status 400.
 * - Throws a generic API error if an unexpected error occurs.
 *
 * Intended use:
 * - Validate request bodies, query parameters, or path params in controllers.
 * - Centralize validation and error formatting logic.
 *
 * @template T The inferred type of the validated schema.
 * @param {ZodSchema<T>} schema The Zod schema used for validation.
 * @param {unknown} data The input data to validate.
 * @throws {ApiError} When validation fails or an unexpected error occurs.
 * @returns {T} The validated and parsed data.
 */
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
