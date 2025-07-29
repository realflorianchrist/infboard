export type Folder = {
    name: string;
    id: string;
    parentFolderId?: string;
    children?: Folder[];
    files?: FileMeta[];
};

export type BaseFileMeta = {
    name: string;
    contentType: string;
    size?: number;
    comment?: string;
    parentFolderId?: string;
};

export type NewFileInput = BaseFileMeta;

export type FileMeta = BaseFileMeta & {
    id: string;
    url?: string;
    version?: number;
    updatedAt?: Date;
    userName?: string;
    meta?: string[];
    downloads?: number;
};

export const isFolder = (obj: unknown): obj is Folder => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "id" in obj &&
        typeof (obj as any).id === "string" &&
        "name" in obj &&
        typeof (obj as any).name === "string" &&
        !("contentType" in obj)
    );
};

export const isFileMeta = (obj: unknown): obj is FileMeta => {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "id" in obj &&
        typeof (obj as any).id === "string" &&
        "name" in obj &&
        typeof (obj as any).name === "string" &&
        "contentType" in obj &&
        typeof (obj as any).contentType === "string"
    );
};