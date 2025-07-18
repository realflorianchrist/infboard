import { z } from 'zod/v4';
import { model, Schema, Types, Document } from 'mongoose';
import {ROOT_FOLDER_ID} from "@workspace/constants/index";

export const FolderSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
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
        name: { type: String, required: true },
        parentFolderId: { type: String, default: ROOT_FOLDER_ID },
    },
    {
        timestamps: { createdAt: 'created', updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

FolderMongooseSchema.index({ name: 1, parentFolderId: 1 }, { unique: true });

FolderMongooseSchema.virtual('id').get(function (this: FolderDocument) {
    return this._id.toHexString();
});

export const FolderModel = model<FolderDocument>('Folder', FolderMongooseSchema);

// (async () => {
//     await FolderModel.syncIndexes();
// })();