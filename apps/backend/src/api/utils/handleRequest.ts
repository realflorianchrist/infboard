import {NextFunction, Request, Response} from "express";
import {ApiResponse} from "@workspace/types";

type HandlerResult<T> = {
    status: number;
    data: T;
};

type RequestHandler<
    TRequestBody,
    TResponseBody,
    TParams = {}
> = (
    req: Request<TParams, {}, TRequestBody>,
    res: Response,
) => Promise<HandlerResult<TResponseBody>>;


export const handleRequest =
    <
        TRequestBody,
        TResponseBody,
        TParams = {}
    >(
        handler: RequestHandler<TRequestBody, TResponseBody, TParams>
    ) =>
        async (
            req: Request<TParams, {}, TRequestBody>,
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