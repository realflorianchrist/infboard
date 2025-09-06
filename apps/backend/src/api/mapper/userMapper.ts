import {User} from "@workspace/types/user";
import {UserDocument} from "@src/models/User";

export const userDocumentToFileMapper = (userDocument: UserDocument): User => {
    return {
        id: userDocument._id.toString(),
        username: userDocument.username,
        email: userDocument.email,
    }
}
