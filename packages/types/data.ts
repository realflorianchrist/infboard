export type Folder = {
    name: string;
    id: string;
    parentFolderId?: string;
    children?: Folder[];
    files?: File[];
};

export type File = {
    id: string;
    url: string;
    name: string;
    version?: number;
    extension?: string;
    size?: number;
    updatedAt?: Date;
    userName?: string;
    meta?: string[];
    comment?: string;
    downloads?: number;
};
