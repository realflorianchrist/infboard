import express, {Router} from "express";
import {ApiRoutes} from "@workspace/routes";
import {handleRequest} from "@src/api/utils/handleRequest";
import {AuthUser, ErrorType, User, UserValidationErrorType, ValidationErrorType} from "@workspace/types";
import {StatusCodes} from "http-status-codes";
import {UserModel, UserSchema} from "@src/models/User";
import {ApiError} from "@src/api/utils/apiError";
import bcrypt from "bcryptjs";
import {userDocumentToFileMapper} from "@src/api/mapper/userMapper";
import {generateToken, verifyToken} from "@src/services/jwtTokenProvider";
import {validateOrThrow} from "@src/api/utils/validateOrThrow";

const authController: Router = express.Router();

authController.get(
    ApiRoutes.auth.validateToken,
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
            } catch (error) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorType.TOKEN_INVALID);
            }
        }
    )
);

authController.post(
    ApiRoutes.auth.register,
    handleRequest<
        { user: AuthUser },
        { user: User, token: string }
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
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.ALREADY_EXISTS, {
                    validationErrors
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            try {
                const userDoc = await UserModel.create({
                    username: username,
                    email: email,
                    password: hashedPassword
                });

                const user = userDocumentToFileMapper(userDoc);

                return {
                    status: StatusCodes.OK,
                    data: {
                        user: user,
                        token: generateToken(user.id!, user.username)
                    }
                };
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, ErrorType.API_ERROR);
            }
        }
    )
);

authController.post(
    ApiRoutes.auth.login,
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

            const user = userDocumentToFileMapper(userDoc);

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

export default authController;