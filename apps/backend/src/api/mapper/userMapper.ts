import {UserDocument} from "@src/models/User";
import {User} from "@workspace/types";

export const userDocumentToFileMapper = (userDocument: UserDocument): User => {
    return {
        id: userDocument._id.toString(),
        username: userDocument.username,
        email: userDocument.email,
    }
}
