import {ApiError} from "@src/api/utils/apiError";
import {JwtPayload} from "jsonwebtoken";
import {StatusCodes} from "http-status-codes";
import {ErrorType} from "@workspace/types";

function assertUser(
    req: Express.Request
): asserts req is Express.Request & { user: JwtPayload } {
    if (!req.user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_INVALID);
    }
}

export default assertUser;