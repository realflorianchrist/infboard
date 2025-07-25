import {z} from "zod";
import {UserValidationErrorType} from "@workspace/types/modelValidation";
import {Document, model, Schema, Types} from "mongoose";
import {FileDocument} from "@src/models/File";

export const UserSchema = z.object({
    id: z.string().optional(),
    created: z.date().optional(),

    username: z.string()
        .min(3, {message: UserValidationErrorType.USERNAME_TOO_SHORT})
        .max(20, {message: UserValidationErrorType.USERNAME_TOO_LONG}),

    email: z.string()
        .email({ message: UserValidationErrorType.INVALID_EMAIL })
        .refine(email => email.endsWith("@students.fhnw.ch"), {
            message: UserValidationErrorType.NOT_AN_FHNW_EMAIL
        }),

    password: z.string()
        .min(3, { message: UserValidationErrorType.PASSWORD_TOO_SHORT })
        .max(20, { message: UserValidationErrorType.PASSWORD_TOO_LONG }),
});

export type IUser = z.infer<typeof UserSchema>;

export interface UserDocument extends Omit<IUser, 'id' | 'created'>, Document {
    _id: Types.ObjectId;
    created: Date;
}

const UserMongooseSchema = new Schema<UserDocument>(
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {
        timestamps: {createdAt: 'created'},
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

UserMongooseSchema.virtual('id').get(function (this: UserDocument) {
    return this._id.toHexString();
});

export const UserModel = model<UserDocument>('User', UserMongooseSchema);
