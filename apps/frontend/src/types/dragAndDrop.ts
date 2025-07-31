import {RowData} from "../components/data_table/DataTable";
import {Folder} from "@workspace/types/data";

export type DnDType = {
    id: string;
    name: string;
    type: 'folder' | 'file';
    parentFolderId?: string;
}

export const rowDataToDnDType = (rowData: RowData): DnDType => {
    return {
        id: rowData.id,
        name: rowData.name,
        parentFolderId: rowData.parentFolderId,
        type: rowData.type,
    }
}

export const folderToDnDType = (folder: Folder): DnDType => {
    return {
        id: folder.id,
        name: folder.name,
        type: 'folder',
        parentFolderId: folder.parentFolderId,
    }
}

export function isDnDType(data: unknown): data is DnDType {
    if (typeof data !== 'object' || data === null) return false;

    const d = data as Partial<DnDType>;

    return (
        typeof d.id === 'string' &&
        typeof d.name === 'string' &&
        typeof d.parentFolderId === 'string' &&
        (d.type === 'folder' || d.type === 'file')
    );
}