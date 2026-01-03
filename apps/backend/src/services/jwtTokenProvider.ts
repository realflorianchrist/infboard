import jwt from "jsonwebtoken";
import {ENV} from "@src/constants/ENV";

/**
 * Payload stored inside the JSON Web Token.
 *
 * @property {string} id The unique user identifier.
 * @property {string} username The username associated with the token.
 */
export type JwtPayload = {
    id: string;
    username: string;
};

/**
 * Generates a signed JSON Web Token for a user.
 *
 * Behavior:
 * - Uses `ENV.JWT_SECRET` to sign the token.
 * - Applies the expiration defined in `ENV.JWT_EXPIRE`.
 * - Encodes the user id and username in the token payload.
 *
 * @param {string} userId The unique identifier of the user.
 * @param {string} username The username of the user.
 * @returns {string} A signed JWT as a string.
 */
export const generateToken = (userId: string, username: string) => {
    const payload: JwtPayload = {
        id: userId,
        username: username
    };

    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRE as jwt.SignOptions['expiresIn'],
    });
};

/**
 * Verifies a JSON Web Token and returns its decoded payload.
 *
 * Behavior:
 * - Verifies the token signature using `ENV.JWT_SECRET`.
 * - Throws an error if the token is invalid or the payload is not an object.
 *
 * @param {string} token The JWT string to verify.
 * @throws {Error} If the token is invalid or the payload format is unexpected.
 * @returns {JwtPayload} The decoded and validated token payload.
 */
export const verifyToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
    }

    return decoded as JwtPayload;
};