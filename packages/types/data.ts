export type Folder = {
    name: string;
    id: string;
    isOpen?: boolean;
    children?: Folder[];
    files?: FileMeta[];
};

export type FileMeta = {
    id: string;
    url: string;
    name: string;
    version: number;
    extension?: string;
    size?: number;
    updatedAt?: string;
    userName?: string;
    meta?: string[];
    comment?: string;
};
