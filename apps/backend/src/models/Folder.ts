import { z } from 'zod/v4';
import { model, Schema, Types, Document } from 'mongoose';

export const FolderSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    created: z.date().optional(),
    parentFolderId: z.string().nullable().optional(),
});

export type IFolder = z.infer<typeof FolderSchema>;

export const newFolder = (input: Partial<IFolder> = {}): IFolder => {
    return FolderSchema.parse({
        id: '',
        name: '',
        created: new Date(),
        parentFolderId: null,
        files: [],
        ...input,
    });
};

export type FolderDocument = Omit<IFolder, 'id' | 'created'> & Document & {
    _id: Types.ObjectId;
    created: Date;
    parentFolderId?: Types.ObjectId | null;
};

const FolderMongooseSchema = new Schema<FolderDocument>(
    {
        name: { type: String, required: true },
        parentFolderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    },
    {
        timestamps: { createdAt: 'created', updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

FolderMongooseSchema.virtual('id').get(function (this: FolderDocument) {
    return this._id.toHexString();
});

export const FolderModel = model<FolderDocument>('Folder', FolderMongooseSchema);
