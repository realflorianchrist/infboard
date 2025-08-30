import {ENV} from "@src/constants/ENV";
import {User} from "@workspace/types";
import {generateToken} from "@src/services/jwtTokenProvider";

export const createConfirmLink = (user: User) => {
    return `${ENV.FRONTEND_URL}/auth/confirm/${generateToken(user.id, user.username)}`;
}