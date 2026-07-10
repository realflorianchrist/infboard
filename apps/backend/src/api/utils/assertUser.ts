import {ApiError} from "@src/api/utils/apiError";
import {JwtPayload} from "jsonwebtoken";
import {StatusCodes} from "http-status-codes";
import {ErrorType} from "@workspace/types";

/**
 * Asserts that an authenticated user is present on the request object.
 *
 * Behavior:
 * - Checks whether `req.user` is defined.
 * - Throws an {@link ApiError} with status 401 if no user is attached.
 *
 * Type narrowing:
 * - Uses a TypeScript `asserts` return type.
 * - After a successful call, `req.user` is guaranteed to exist and be typed
 *   as {@link JwtPayload}.
 *
 * Intended use:
 * - Called from authentication or authorization middleware.
 * - Used inside route handlers to safely access `req.user` without null checks.
 *
 * @param {Express.Request} req Express request object.
 * @throws {ApiError} If no authenticated user is present on the request.
 * @returns {void}
 */
function assertUser(
    req: Express.Request
): asserts req is Express.Request & { user: JwtPayload } {
    if (!req.user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_INVALID);
    }
}

export default assertUser;