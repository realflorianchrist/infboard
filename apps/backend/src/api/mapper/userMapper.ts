import {UserDocument} from "@src/models/User";
import {User} from "@workspace/types";

export const userDocumentToUserMapper = (userDocument: UserDocument): User => {
    return {
        id: userDocument._id.toString(),
        username: userDocument.username,
        email: userDocument.email,
    }
}
