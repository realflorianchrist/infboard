import { fileDocumentToFileMapper } from "@src/api/mapper/fileMapper";
import { folderDocumentToFolderMapper } from "@src/api/mapper/folderMapper";
import { FileDocument, FileModel, FileSnapshot } from "@src/models/File";
import { FolderDocument, FolderModel, FolderSnapshot } from "@src/models/Folder";
import { ROOT_FOLDER_ID } from "@workspace/constants";
import { ChangeReason, FileChangeEvent, Folder } from "@workspace/types";

/**
 * Loads all folders from the database and builds a hierarchical folder tree.
 *
 * Notes:
 * - Sorts folders by name (ascending) before building the tree.
 * - Uses the folder's `parentFolderId` to attach children to their parent.
 * - Folders whose parent is missing (or `parentFolderId` is not set) become roots.
 * - Files are not included here, `files` is always undefined in the result.
 *
 * @returns {Promise<Folder[]>} A list of root folders, each with nested `children`.
 */
export const getFolderTree = async (): Promise<Folder[]> => {
    const flatFolders = await FolderModel.find().sort({ name: 1 }).lean({ virtuals: true });

    const folderMap = new Map<string, Folder>();

    for (const f of flatFolders) {
        folderMap.set(f.id, {
            id: f.id,
            name: f.name,
            parentFolderId: f.parentFolderId,
            children: [],
            deleted: f.deleted
        });
    }

    const roots: Folder[] = [];

    for (const f of flatFolders) {
        const current = folderMap.get(f.id);
        if (!current) continue;

        const parentId = f.parentFolderId;
        if (parentId && folderMap.has(parentId)) {
            const parent = folderMap.get(parentId)!;
            parent.children?.push(current);
        } else {
            roots.push(current);
        }
    }

    return roots;
};

/**
 * Loads a folder and its direct contents (subfolders + files) for display.
 *
 * Behavior:
 * - Returns a synthetic root folder when `folderId === ROOT_FOLDER_ID`.
 * - Otherwise loads the folder by id and returns its direct children and files.
 * - Sorting: subfolders and files are each sorted by `name` ascending.
 *
 * Deleted handling:
 * - When `includeDeleted` is `true`, the query option `{ includeDeleted: true }`
 *   is passed to Mongoose via `setOptions(...)` (requires matching plugin/support).
 * - When `includeDeleted` is `false`, default query behavior applies.
 *
 * @param {string} folderId The folder id to load, or `ROOT_FOLDER_ID` for the virtual root.
 * @param {boolean} includeDeleted Whether to include deleted subfolders/files in the result.
 * @returns {Promise<Folder | null>} The folder with `children` and `files`, or `null` if not found.
 */
export const getFolderContents = async (
    folderId: string,
    includeDeleted: boolean
): Promise<Folder | null> => {
    const findOpts = includeDeleted ? { includeDeleted: true } : undefined;

    // TODO: fix mappers to support lean
    const listChildren = async (parentId: string) => {
        const [subfolderDocs, fileDocs] = await Promise.all([
            FolderModel.find({ parentFolderId: parentId })
                .setOptions(findOpts ?? {}).sort({ name: 1 }),
            // .lean({ virtuals: true }),

            FileModel.find({ parentFolderId: parentId })
                .setOptions(findOpts ?? {}).sort({ name: 1 })
            // .lean({ virtuals: true }),
        ]);

        return {
            subfolders: subfolderDocs.map(folderDocumentToFolderMapper),
            files: fileDocs.map(f => fileDocumentToFileMapper(f)),
        };
    };

    if (folderId === ROOT_FOLDER_ID) {
        const { subfolders, files } = await listChildren(ROOT_FOLDER_ID);
        return {
            id: ROOT_FOLDER_ID,
            name: ROOT_FOLDER_ID,
            children: subfolders,
            files,
            deleted: false
        };
    }

    const folderDoc = await FolderModel.findById(folderId).setOptions(findOpts ?? {}).lean({ virtuals: true });
    if (!folderDoc) return null;

    const { subfolders, files } = await listChildren(folderId);

    return {
        id: folderDoc.id,
        name: folderDoc.name,
        children: subfolders,
        files,
        deleted: folderDoc.deleted
    };
};

const checkForUpdate = <T>(oldValue: T | undefined, newValue: T | undefined) => {
    if (newValue !== oldValue) {
        return {
            from: oldValue,
            to: newValue
        };
    }
};


export const reconstructFileHistory = (fileDoc: FileDocument) => {
    const fileChangeEvents: FileChangeEvent[] =
        fileDoc.previousVersions.map(v => {
            return {
                version: v.version,
                updatedAt: v.createdAt,
                updatedBy: v.updatedBy,
                reason: v.reason,
                changes: [],
                restoreFromVersion: v.restoreFromVersion,
            };
        });
};

/**
 * Creates an immutable snapshot of a file document for version history.
 *
 * Intended use:
 * - Store in `previousVersions` (or similar) before mutating the file.
 * - Allows reconstructing past states and showing an audit trail.
 *
 * Snapshot contents:
 * - Metadata: the file's current `version`, snapshot `createdAt`, and audit fields.
 * - State: a subset of the file properties needed to restore or display history.
 *
 * @param {FileDocument} file The current file document (typically read within a session/transaction).
 * @param {{ updatedBy: string; reason: ChangeReason; restoreFromVersion?: number; }} options
 * Audit information describing why the snapshot was created.
 * @param {string} options.updatedBy Username or identifier of the user making the change.
 * @param {ChangeReason} options.reason Reason for the snapshot.
 * @param {number} [options.restoreFromVersion] If reason is "restore", the version restored from.
 * @returns {FileSnapshot} A snapshot object containing versioned state for this file.
 */
export const createFileSnapshot = (
    file: FileDocument,
    options: {
        updatedBy: string;
        reason: ChangeReason;
        restoreFromVersion?: number;
    }
): FileSnapshot => {
    return {
        version: file.version,
        createdAt: new Date(),
        updatedBy: options.updatedBy,
        reason: options.reason,
        restoreFromVersion: options.restoreFromVersion,

        state: {
            name: file.name,
            contentType: file.contentType,
            size: file.size,
            userName: file.userName,
            parentFolderId: file.parentFolderId,
            comment: file.comment,
            deleted: file.deleted,
            s3Key: file.s3Key,
        },
    };
};

/**
 * Creates an immutable snapshot of a folder document for version history.
 *
 * Intended use:
 * - Store in `previousVersions` (or similar) before mutating the folder.
 * - Allows reconstructing past states and showing an audit trail.
 *
 * Snapshot contents:
 * - Metadata: the folder's current `version`, snapshot `createdAt`, and audit fields.
 * - State: a subset of folder properties needed to restore or display history.
 *
 * @param {FolderDocument} folder The current folder document (typically read within a session/transaction).
 * @param {{ updatedBy: string; reason: ChangeReason; restoreFromVersion?: number; }} options
 * Audit information describing why the snapshot was created.
 * @param {string} options.updatedBy Username or identifier of the user making the change.
 * @param {ChangeReason} options.reason Reason for the snapshot.
 * @param {number} [options.restoreFromVersion] If reason is "restore", the version restored from.
 * @returns {FolderSnapshot} A snapshot object containing versioned state for this folder.
 */
export const createFolderSnapshot = (
    folder: FolderDocument,
    options: {
        updatedBy: string;
        reason: ChangeReason;
        restoreFromVersion?: number;
    }
): FolderSnapshot => {
    return {
        version: folder.version,
        createdAt: new Date(),
        updatedBy: options.updatedBy,
        reason: options.reason,
        restoreFromVersion: options.restoreFromVersion,

        state: {
            name: folder.name,
            parentFolderId: folder.parentFolderId,
            userName: folder.userName,
            deleted: folder.deleted,
        },
    };
};