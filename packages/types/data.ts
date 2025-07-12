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

