import {z} from 'zod';
import {Document, model, Query, Schema, Types} from 'mongoose';
import {FolderValidationErrorType} from "@workspace/types";
import {ROOT_FOLDER_ID} from "@workspace/constants";

export const FolderVersionSchema = z.object({
    version: z.number(),
    name: z.string().optional(),
    updatedAt: z.date().optional(),
    parentFolderId: z.string().optional(),
    deleted: z.boolean().optional(),
});

export const FolderSchema = z.object({
    id: z.string().optional(),
    name: z.string()
        .min(1, {message: FolderValidationErrorType.FOLDER_NAME_EMPTY})
        .max(20, {message: FolderValidationErrorType.FOLDER_NAME_TOO_LONG}),

    version: z.number()
        .default(1)
        .refine(val => val === undefined || val >= 0, {
            message: FolderValidationErrorType.FOLDER_VERSION_NEGATIVE,
        }),

    created: z.date().optional(),
    parentFolderId: z.string().default(ROOT_FOLDER_ID),
    updatedAt: z.date().optional(),
    deleted: z.boolean().optional(),
    previousVersions: z.array(FolderVersionSchema).optional(),
});

export const UpdateFolderSchema = FolderSchema
    .omit({ id: true, created: true, previousVersions: true })
    .partial()
    .extend({ id: z.string() });

export type IFolder = z.infer<typeof FolderSchema>;
export type IUpdateFolder = z.infer<typeof UpdateFolderSchema>;
export type FolderVersion = z.infer<typeof FolderVersionSchema>;

export type FolderDocument = Omit<IFolder, 'id' | 'created'> & Document & {
    _id: Types.ObjectId;
    created: Date;
};

const FolderMongooseSchema = new Schema<FolderDocument>(
    {
        name: {type: String, required: true},
        parentFolderId: {type: String, required: true, default: ROOT_FOLDER_ID},
        version: {type: Number, required: true, default: 1},
        deleted: {type: Boolean, default: false},
        previousVersions: [{
            version: Number,
            name: String,
            updatedAt: Date,
            parentFolderId: String,
            deleted: Boolean,
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
            this.where({deleted: false});
        }

        if (opts.includeDeleted != null) {
            const {includeDeleted: _x, ...rest} = opts;
            this.setOptions(rest);
        }

        next();
    });
};

FolderMongooseSchema.plugin(softDeletePlugin);

FolderMongooseSchema.index({name: 1, parentFolderId: 1}, {unique: true});

FolderMongooseSchema.virtual('id').get(function (this: FolderDocument) {
    return this._id.toHexString();
});

export const FolderModel = model<FolderDocument>('Folder', FolderMongooseSchema);

// (async () => {
//     await FolderModel.syncIndexes();
// })();