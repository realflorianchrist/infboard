import {z} from 'zod';
import {model, Schema, Types, Document, Query} from 'mongoose';
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {FileValidationErrorType} from "@workspace/types";
import {makeUpdateSchema} from "@src/utils/makeUpdateSchema";


export const FileVersionSchema = z.object({
    version: z.number(),
    name: z.string().optional(),
    contentType: z.string().optional(),
    size: z.number().optional(),
    status: z.string().optional(),
    updatedAt: z.date().optional(),
    userName: z.string().optional(),
    parentFolderId: z.string(),
    comment: z.string().optional(),
    deleted: z.boolean().optional(),
    s3Key: z.string().optional()
});

export const FileSchema = z.object({
    id: z.string().optional(),
    created: z.date().optional(),

    name: z.string()
        .min(1, {message: FileValidationErrorType.FILE_NAME_EMPTY})
        .max(100, {message: FileValidationErrorType.FILE_NAME_TOO_LONG}),

    version: z.number()
        .optional()
        .refine(val => val === undefined || val >= 0, {
            message: FileValidationErrorType.FILE_VERSION_NEGATIVE,
        }),

    contentType: z.string()
        .min(1, {message: FileValidationErrorType.FILE_CONTENT_TYPE_EMPTY}),

    size: z.number()
        .optional()
        .refine(val => val === undefined || val >= 0, {
            message: FileValidationErrorType.FILE_SIZE_NEGATIVE,
        }),

    updatedAt: z.date().optional(),
    userName: z.string().optional(),
    comment: z.string().optional(),
    downloads: z.number().optional(),
    parentFolderId: z.string().default(ROOT_FOLDER_ID),
    deleted: z.boolean().optional(),
    s3Key: z.string().optional(),
    previousVersions: z.array(FileVersionSchema).optional(),
});


export const UpdateFileSchema = makeUpdateSchema(FileSchema);

export type IFile = z.infer<typeof FileSchema>;
export type FileVersion = z.infer<typeof FileVersionSchema>;

export interface FileDocument extends Omit<IFile, 'id' | 'created'>, Document {
    _id: Types.ObjectId;
    created: Date;
}

const FileMongooseSchema = new Schema<FileDocument>(
    {
        name: {type: String, required: true},
        version: {type: Number, required: true, default: 1},
        contentType: String,
        size: Number,
        updatedAt: Date,
        userName: String,
        comment: String,
        downloads: {type: Number, default: 0},
        parentFolderId: {type: String, required: true, default: ROOT_FOLDER_ID},
        deleted: {type: Boolean, default: false},
        s3Key: String,
        previousVersions: [{
            version: Number,
            name: String,
            contentType: String,
            size: Number,
            status: String,
            updatedAt: Date,
            userName: String,
            parentFolderId: String,
            comment: String,
            deleted: Boolean,
            s3Key: String,
        }]
    },
    {
        timestamps: {createdAt: 'created', updatedAt: 'updatedAt'},
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

const softDeletePlugin = (schema: Schema) => {
    schema.pre(/^find/, function (this: Query<any, any>, next) {
        const opts: any = this.getOptions?.() ?? (this as any).options ?? {};
        const includeDeleted = opts.includeDeleted === true;

        if (!includeDeleted) {
            this.where({ deleted: false });
        }

        if (opts.includeDeleted != null) {
            const { includeDeleted: _x, ...rest } = opts;
            this.setOptions(rest);
        }

        next();
    });
};

FileMongooseSchema.plugin(softDeletePlugin);

FileMongooseSchema.index({name: 1, parentFolderId: 1}, {unique: true});

FileMongooseSchema.virtual('id').get(function (this: FileDocument) {
    return this._id.toHexString();
});

export const FileModel = model<FileDocument>('File', FileMongooseSchema);

// (async () => {
//     await FileModel.syncIndexes();
// })();
