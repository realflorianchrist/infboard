import {z} from 'zod';
import {Document, model, Query, Schema, Types} from 'mongoose';
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {CHANGE_REASONS, FileValidationErrorType} from "@workspace/types";
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';


export const FileStateSchema = z.object({
    name: z.string(),
    contentType: z.string(),
    size: z.number().optional(),
    userName: z.string().optional(),
    parentFolderId: z.string(),
    comment: z.string().optional(),
    deleted: z.boolean().optional(),
    s3Key: z.string().optional(),
});

export const FileSnapshotSchema = z.object({
    version: z.number(),
    createdAt: z.date(),
    updatedBy: z.string(),
    state: FileStateSchema,
    reason: z.enum(CHANGE_REASONS),
    restoreFromVersion: z.number().optional(),
});

export const FileSchema = z.object({
    id: z.string().optional(),
    created: z.date().optional(),

    name: z.string()
        .min(1, {message: FileValidationErrorType.FILE_NAME_EMPTY})
        .max(100, {message: FileValidationErrorType.FILE_NAME_TOO_LONG}),

    version: z.number()
        .default(1)
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
    previousVersions: z.array(FileSnapshotSchema).default([]),
});

export const UpdateFileSchema = FileSchema
    .omit({ id: true, created: true, previousVersions: true })
    .partial()
    .extend({ id: z.string() });

export type IFile = z.infer<typeof FileSchema>;
export type IUpdateFile = z.infer<typeof UpdateFileSchema>;
export type FileSnapshot = z.infer<typeof FileSnapshotSchema>;

export interface FileDocument extends Omit<IFile, 'id' | 'created'>, Document {
    _id: Types.ObjectId;
    id: string;
    created: Date;
}

const FileStateMongooseSchema = new Schema(
    {
        name: { type: String, required: true },
        contentType: { type: String, required: true },
        size: { type: Number },
        userName: { type: String },
        parentFolderId: { type: String, required: true, default: ROOT_FOLDER_ID },
        comment: { type: String },
        deleted: { type: Boolean, default: false },
        s3Key: { type: String },
    },
    { _id: false }
);

const FileSnapshotMongooseSchema = new Schema(
    {
        version: { type: Number, required: true },
        createdAt: { type: Date, required: true },
        updatedBy: { type: String, required: true },
        reason: { type: String, enum: CHANGE_REASONS, required: true },
        restoreFromVersion: { type: Number },
        state: { type: FileStateMongooseSchema, required: true },
    },
    { _id: false }
);

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
        previousVersions: { type: [FileSnapshotMongooseSchema], default: [] },
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

FileMongooseSchema.plugin(mongooseLeanVirtuals);

export const FileModel = model<FileDocument>('File', FileMongooseSchema);

// (async () => {
//     await FileModel.syncIndexes();
// })();
