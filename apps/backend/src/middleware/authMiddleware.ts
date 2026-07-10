import {NextFunction, Request, Response} from 'express';
import {ErrorType} from "@workspace/types";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import {JwtPayload, verifyToken} from "@src/services/jwtTokenProvider";

declare global {
    namespace Express {
        interface Request {
            /**
             * Decoded JWT payload attached by {@link authenticateToken} when authentication succeeds.
             */
            user?: JwtPayload;
        }
    }
}


/**
 * Express middleware that authenticates requests using a Bearer JWT.
 *
 * Behavior:
 * - Expects an `Authorization` header in the form `Bearer <token>`.
 * - Verifies the token via {@link verifyToken}.
 * - Attaches the decoded payload to `req.user` on success.
 * - For missing tokens, forwards an {@link ApiError} with `401 TOKEN_MISSING`.
 * - For invalid token payload shape, forwards an {@link ApiError} with `401 TOKEN_INVALID`.
 * - Any verification errors are forwarded to the global error handler via `next(err)`.
 *
 * Side effects:
 * - Mutates the request object by setting `req.user`.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object (not used directly).
 * @param {NextFunction} next Callback to pass control to the next middleware.
 * @returns {void}
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_MISSING));
        }

        const payload = verifyToken(token);
        if (typeof payload !== "object" || payload === null) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_INVALID));
        }

        req.user = payload;
        next();
    } catch (err) {
        next(err);
    }
}
