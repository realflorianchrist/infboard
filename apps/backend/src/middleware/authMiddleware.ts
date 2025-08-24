import {NextFunction, Request, Response} from 'express';
import {ErrorType} from "@workspace/types";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import {verifyToken} from "@src/services/jwtTokenProvider";
import {JwtPayload} from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
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
