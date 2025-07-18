import {z} from 'zod';
import {model, Schema, Types, Document} from 'mongoose';
import {ROOT_FOLDER_ID} from "@workspace/constants/index";
import {FolderValidationErrorType} from "@workspace/types/modelValidation";

export const FolderSchema = z.object({
    id: z.string().optional(),
    name: z.string()
        .min(1, {message: FolderValidationErrorType.NAME_EMPTY})
        .max(20, {message: FolderValidationErrorType.NAME_TOO_LONG}),
    created: z.date().optional(),
    parentFolderId: z.string().default(ROOT_FOLDER_ID),
});

export type IFolder = z.infer<typeof FolderSchema>;

export type FolderDocument = Omit<IFolder, 'id' | 'created'> & Document & {
    _id: Types.ObjectId;
    created: Date;
};

const FolderMongooseSchema = new Schema<FolderDocument>(
    {
        name: {type: String, required: true},
        parentFolderId: {type: String, required: true, default: ROOT_FOLDER_ID},
    },
    {
        timestamps: {createdAt: 'created', updatedAt: false},
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

FolderMongooseSchema.index({name: 1, parentFolderId: 1}, {unique: true});

FolderMongooseSchema.virtual('id').get(function (this: FolderDocument) {
    return this._id.toHexString();
});

export const FolderModel = model<FolderDocument>('Folder', FolderMongooseSchema);

// (async () => {
//     await FolderModel.syncIndexes();
// })();