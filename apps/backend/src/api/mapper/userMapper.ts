import {UserDocument} from "@src/models/User";
import {User} from "@workspace/types";

export const userDocumentToUserMapper = (userDocument: UserDocument): User => {
    return {
        id: userDocument.id,
        username: userDocument.username,
        email: userDocument.email,
    }
}
