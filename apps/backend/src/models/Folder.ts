import { z } from 'zod/v4';
import { model, Schema, Types, Document } from 'mongoose';
import { FileSchema } from './File';

export const FolderSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    created: z.date().optional(),
    parentId: z.string().nullable().optional(),
    files: z.array(FileSchema).optional(),
});

export type IFolder = z.infer<typeof FolderSchema>;

export const newFolder = (input: Partial<IFolder> = {}): IFolder => {
    return FolderSchema.parse({
        id: '',
        name: '',
        created: new Date(),
        parentId: null,
        files: [],
        ...input,
    });
};

export type FolderDocument = Omit<IFolder, 'id' | 'created'> & Document & {
    _id: Types.ObjectId;
    created: Date;
    parentId?: Types.ObjectId | null;
};

const FolderMongooseSchema = new Schema<FolderDocument>(
    {
        name: { type: String, required: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
        files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
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
