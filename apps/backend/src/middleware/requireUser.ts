import {NextFunction, Request, Response} from "express";
import assertUser from "@src/api/utils/assertUser";

/**
 * Express middleware that ensures an authenticated user is present on the request.
 *
 * Behavior:
 * - Expects a previous authentication middleware to have attached a user to `req.user`.
 * - Delegates the actual check to {@link assertUser}.
 * - Forwards any thrown error to the global error handler.
 *
 * Typical usage:
 * - Place this middleware after authentication middleware such as `authenticateToken`.
 * - Protect routes that require a logged-in user.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object (not used directly).
 * @param {NextFunction} next Callback to pass control to the next middleware.
 * @returns {void}
 */
export function requireUser(req: Request, res: Response, next: NextFunction): void {
    try {
        assertUser(req);
        next();
    } catch (e) {
        next(e);
    }
}