import express, {Router} from "express";
import {handleRequest} from "@src/api/utils/handleRequest";
import {ErrorType} from "@workspace/types";
import {StatusCodes} from "http-status-codes";
import mailService from "@src/config/mail";
import {ApiError} from "@src/api/utils/apiError";
import {createConfirmLink} from "@src/services/userService";

const openController: Router = express.Router();

openController.get(
    "/test-email",
    handleRequest<{}, { message: string }>(
        async () => {

            const user = {
                username: "realflorianchrist",
                email: "flo.ch@gmx.ch"
            };

            try {
                await mailService.sendEmailConfirmEMail(user, createConfirmLink(user));

                return {
                    status: StatusCodes.OK,
                    data: {
                        message: `Email sent to ${user.email}`,
                    }
                }
            } catch {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            }
        }
    )
);

export default openController;