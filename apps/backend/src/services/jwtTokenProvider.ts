import jwt from "jsonwebtoken";
import {ENV} from "@src/constants/ENV";

type JwtPayload = {
    id: string;
    username: string;
};

export const generateToken = (userId: string, username: string) => {
    const payload: JwtPayload = {
        id: userId,
        username: username
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRE as jwt.SignOptions['expiresIn'],
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_SECRET);
};