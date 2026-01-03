import {NextFunction, Request, Response} from "express";
import assertUser from "@src/api/utils/assertUser";

export function requireUser(req: Request, res: Response, next: NextFunction) {
    try {
        assertUser(req);
        next();
    } catch (e) {
        next(e);
    }
}