import jwt from "jsonwebtoken";
import {ENV} from "@src/constants/ENV";

export type JwtPayload = {
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

export const verifyToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
    }

    return decoded as JwtPayload;
};