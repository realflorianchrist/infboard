import {z} from 'zod';
import {model, Schema, Types, Document, Query} from 'mongoose';
import {ROOT_FOLDER_ID} from "@workspace/constants/index";
import {FileValidationErrorType} from "@workspace/types/modelValidation";


export const FileSchema = z.object({
    id: z.string().optional(),
    created: z.date().optional(),

    name: z.string()
        .min(1, { message: FileValidationErrorType.NAME_EMPTY })
        .max(100, { message: FileValidationErrorType.NAME_TOO_LONG }),

    version: z.number()
        .optional()
        .refine(val => val === undefined || val >= 0, {
            message: FileValidationErrorType.VERSION_NEGATIVE,
        }),

    contentType: z.string()
        .min(1, { message: FileValidationErrorType.CONTENT_TYPE_EMPTY }),

    size: z.number()
        .optional()
        .refine(val => val === undefined || val >= 0, {
            message: FileValidationErrorType.SIZE_NEGATIVE,
        }),

    updatedAt: z.date().optional(),
    userName: z.string().optional(),
    meta: z.array(z.string()).optional(),
    comment: z.string().optional(),
    downloads: z.number().optional(),
    parentFolderId: z.string().default(ROOT_FOLDER_ID),
    deleted: z.boolean().optional(),
});

export type IFile = z.infer<typeof FileSchema>;

export interface FileDocument extends Omit<IFile, 'id' | 'created'>, Document {
    _id: Types.ObjectId;
    created: Date;
}

const FileMongooseSchema = new Schema<FileDocument>(
    {
        name: {type: String, required: true},
        version: {type: Number, default: 1},
        contentType: String,
        size: Number,
        updatedAt: Date,
        userName: String,
        meta: [String],
        comment: String,
        downloads: {type: Number, default: 0},
        parentFolderId: {type: String, required: true, default: ROOT_FOLDER_ID},
        deleted: {type: Boolean, default: false},
    },
    {
        timestamps: {createdAt: 'created', updatedAt: 'updatedAt'},
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

const softDeletePlugin = (schema: Schema) => {
    schema.pre(/^find/, function (this: Query<any, any>, next) {
        const queryFilter = this.getFilter();

        if (!queryFilter.includeDeleted) {
            this.where({deleted: false});
        } else {
            const {includeDeleted, ...rest} = queryFilter;
            this.setQuery(rest);
        }

        next();
    });
}

FileMongooseSchema.plugin(softDeletePlugin);

FileMongooseSchema.index({name: 1, parentFolderId: 1}, {unique: true});

FileMongooseSchema.virtual('id').get(function (this: FileDocument) {
    return this._id.toHexString();
});

export const FileModel = model<FileDocument>('File', FileMongooseSchema);

// (async () => {
//     await FileModel.syncIndexes();
// })();
