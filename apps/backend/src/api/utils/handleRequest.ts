import {NextFunction, Request, Response} from "express";
import {ApiResponse} from "@workspace/types";

/**
 * The standardized result a request handler must return.
 *
 * @template T The response body type.
 * @property {number} status HTTP status code to send.
 * @property {T} data Response body payload.
 */
type HandlerResult<T> = {
    status: number;
    data: T;
};

/**
 * Async request handler signature used by {@link handleRequest}.
 *
 * Notes:
 * - The handler returns an object containing `status` and `data`.
 * - The handler can use `res` for side effects if needed (cookies, headers),
 *   but the response body should be returned via the {@link HandlerResult}.
 *
 * @template TRequestBody Type of `req.body`.
 * @template TResponseBody Type of the response body.
 * @template TReqParams Type of `req.params`.
 * @template TReqQuery Type of `req.query`.
 *
 * @param {Request<TReqParams, {}, TRequestBody, TReqQuery>} req Express request object.
 * @param {Response} res Express response object.
 * @returns {Promise<HandlerResult<TResponseBody>>} Status code and response payload.
 */
type RequestHandler<
    TRequestBody,
    TResponseBody,
    TReqParams = {},
    TReqQuery = {}
> = (
    req: Request<TReqParams, {}, TRequestBody, TReqQuery>,
    res: Response,
) => Promise<HandlerResult<TResponseBody>>;


/**
 * Wraps an async handler and converts it into an Express middleware with unified error handling.
 *
 * Behavior:
 * - Executes the provided `handler`.
 * - Sends the returned `{ status, data }` as JSON via `res.status(status).json(data)`.
 * - Forwards thrown errors to the Express error pipeline using `next(err)`.
 *
 * Intended use:
 * - Keep controllers clean by avoiding repetitive `try/catch` blocks.
 * - Enforce a consistent "return status + data" pattern across route handlers.
 *
 * Example:
 * ```ts
 * router.get("/me", handleRequest(async (req) => {
 *   return { status: 200, data: { id: req.user!.id } };
 * }));
 * ```
 *
 * @template TRequestBody Type of `req.body`.
 * @template TResponseBody Type of the response body.
 * @template TReqParams Type of `req.params`.
 * @template TReqQuery Type of `req.query`.
 * @param {RequestHandler<TRequestBody, TResponseBody, TReqParams, TReqQuery>} handler
 * The async handler to execute.
 * @returns {(req: Request<TReqParams, {}, TRequestBody, TReqQuery>, res: Response<ApiResponse<TResponseBody>>, next: NextFunction) => Promise<void>}
 * Express middleware function.
 */
export const handleRequest =
    <
        TRequestBody,
        TResponseBody,
        TReqParams = {},
        TReqQuery = {}
    >(
        handler: RequestHandler<TRequestBody, TResponseBody, TReqParams, TReqQuery>
    ): (req: Request<TReqParams, {}, TRequestBody, TReqQuery>, res: Response<ApiResponse<TResponseBody>>, next: NextFunction) => Promise<void> =>
        async (
            req: Request<TReqParams, {}, TRequestBody, TReqQuery>,
            res: Response<ApiResponse<TResponseBody>>,
            next: NextFunction
        ) => {
            try {
                const {status, data} = await handler(req, res);
                res.status(status).json(data);
            } catch (err) {
                next(err);
            }
        };