import express, {Router} from "express";
import {apiRoutes} from "@workspace/routes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {AuthUser, ErrorType, User, UserValidationErrorType, ValidationErrorType} from "@workspace/types";
import {StatusCodes} from "http-status-codes";
import {UserModel, UserSchema} from "@src/models/User";
import {ApiError} from "@src/api/utils/apiError";
import bcrypt from "bcryptjs";
import {userDocumentToUserMapper} from "@src/api/mapper/userMapper";
import {generateToken, verifyToken} from "@src/services/jwtTokenProvider";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";
import mailService from "@src/config/mail";
import {createConfirmLink} from "@src/services/userService";
import mongoose from "mongoose";

const authController: Router = express.Router();

authController.get(
    apiRoutes.auth.validateToken,
    handleRequest<
        {},
        { success: boolean }
    >(
        async (req) => {

            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];

            if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_MISSING);

            try {
                verifyToken(token);
                return {
                    status: StatusCodes.OK,
                    data: {
                        success: true,
                    }
                }
            } catch {
                throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_INVALID);
            }
        }
    )
);

authController.post(
    apiRoutes.auth.register,
    handleRequest<
        { user: AuthUser },
        { user: User }
    >(
        async (req) => {

            const validated = validateOrThrow(UserSchema, req.body.user);

            const {username, email, password} = validated;

            const existingUser = await UserModel.findOne({
                $or: [{username}, {email}]
            });

            const validationErrors: ValidationErrorType[] = [];

            if (existingUser?.username === username) {
                validationErrors.push(UserValidationErrorType.USERNAME_ALREADY_EXISTS);
            }

            if (existingUser?.email === email) {
                validationErrors.push(UserValidationErrorType.EMAIL_ALREADY_EXISTS);
            }

            if (validationErrors.length > 0) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR, {
                    validationErrors
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const session = await mongoose.startSession();
            try {
                session.startTransaction();

                const userDoc = await UserModel.create([{
                    username: username,
                    email: email,
                    password: hashedPassword
                }], {session});

                const user = userDocumentToUserMapper(userDoc[0]);

                try {
                    await mailService.sendEmailConfirmEMail(user, createConfirmLink(user));
                } catch {
                    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.SEND_EMAIL_FAILED);
                }

                await session.commitTransaction();

                return {
                    status: StatusCodes.OK,
                    data: {
                        user: user,
                    }
                };
            } catch (error) {
                await session.abortTransaction();

                if (error instanceof ApiError) throw error;

                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            } finally {
                await session.endSession();
            }
        }
    )
);

authController.post(
    apiRoutes.auth.login,
    handleRequest<
        { user: AuthUser },
        { user: User, token: string }
    >(
        async (req) => {

            const {username, email, password} = req.body.user;

            if ((!username && !email) || !password) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.VALIDATION_ERROR);
            }

            const userDoc = await UserModel.findOne({
                $or: [
                    ...(username ? [{username}] : []),
                    ...(email ? [{email}] : []),
                ]
            });

            if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.BAD_CREDENTIALS);
            }

            if (!userDoc.isEmailVerified) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.EMAIL_NOT_VERIFIED);
            }

            const user = userDocumentToUserMapper(userDoc);

            return {
                status: StatusCodes.OK,
                data: {
                    user: user,
                    token: generateToken(user.id!, user.username)
                }
            };
        }
    )
);

authController.post(
    apiRoutes.auth.confirmEmail,
    handleRequest<
        { token: string },
        { user: User, token: string }
    >(
        async (req) => {

            const token = req.body.token;

            try {
                const payload = verifyToken(token);

                if (typeof payload !== "object" || payload === null) {
                    throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_INVALID);
                }

                const updated = await UserModel.findOneAndUpdate(
                    {_id: payload.id, isEmailVerified: {$ne: true}},
                    {$set: {isEmailVerified: true}},
                    {new: true}
                );

                if (!updated) {
                    const exists = await UserModel.exists({_id: payload.id});
                    if (!exists) {
                        throw new ApiError(StatusCodes.NOT_FOUND, ErrorType.USER_NOT_FOUND);
                    }
                    throw new ApiError(StatusCodes.FORBIDDEN, ErrorType.EMAIL_ALREADY_VERIFIED);
                }

                return {
                    status: StatusCodes.OK,
                    data: {
                        user: userDocumentToUserMapper(updated),
                        token: token
                    }
                }

            } catch (error) {
                if (error instanceof ApiError) throw error;

                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.EMAIL_VERIFICATION_FAILED)
            }
        }
    )
);

authController.post(
    apiRoutes.auth.resendConfirmEmail,
    handleRequest<
        { user: User },
        {}
    >(
        async (req) => {

            const user = req.body.user;

            try {
                await mailService.sendEmailConfirmEMail(user, createConfirmLink(user));

                return {
                    status: StatusCodes.OK,
                    data: {}
                }

            } catch {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.SEND_EMAIL_FAILED)
            }
        }
    )
);

export default authController;