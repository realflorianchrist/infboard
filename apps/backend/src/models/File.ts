import { z } from 'zod/v4';
import { model, Schema, Types, Document } from 'mongoose';

export const FileSchema = z.object({
    id: z.string().optional(),
    created: z.date().optional(),
    url: z.string().optional(),
    name: z.string(),
    version: z.number().optional(),
    contentType: z.string(),
    size: z.number().optional(),
    updatedAt: z.date().optional(),
    userName: z.string().optional(),
    meta: z.array(z.string()).optional(),
    comment: z.string().optional(),
    downloads: z.number().optional(),
    parentFolderId: z.string().optional(),
});

export type IFile = z.infer<typeof FileSchema>;

export const newFile = (input: Partial<IFile> = {}): IFile => {
    return FileSchema.parse({
        id: undefined,
        created: new Date(),
        url: '',
        name: '',
        contentType: '',
        ...input,
    });
};

export interface FileDocument extends Omit<IFile, 'id' | 'created'>, Document {
    _id: Types.ObjectId;
    created: Date;
}

const FileMongooseSchema = new Schema<FileDocument>(
    {
        url: String,
        name: { type: String, required: true },
        version: Number,
        contentType: String,
        size: Number,
        updatedAt: Date,
        userName: String,
        meta: [String],
        comment: String,
        downloads: String,
        parentFolderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
    },
    {
        timestamps: { createdAt: 'created', updatedAt: 'updatedAt' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

FileMongooseSchema.virtual('id').get(function (this: FileDocument) {
    return this._id.toHexString();
});

export const FileModel = model<FileDocument>('File', FileMongooseSchema);
