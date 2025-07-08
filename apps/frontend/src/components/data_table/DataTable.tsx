'use client'
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@workspace/ui/components/table";
import {Fragment, useEffect, useState} from "react";
import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {IoFolderOutline} from "react-icons/io5";
import {GoFile} from "react-icons/go";
import {useGetFolderById} from "@/src/api/hooks/folderHooks";
import FolderContextMenu from "@/src/components/context_menus/FolderContextMenu";
import FileContextMenu from "@/src/components/context_menus/FileContextMenu";

type Row = {
    id: string;
    name: string;
    type: 'folder' | 'file';
    updatedAt?: Date;
    userName?: string;
    version?: number;
    comment?: string;
    downloads?: number;
    size?: number;
    // meta?: string[];
}


export default function DataTable() {
    const {path, pushFolder} = useFolderPath();

    const columnHelper = createColumnHelper<Row>();

    const [data, setData] = useState<Row[]>([]);

    const folderId = path?.[path.length - 1]?.id;
    const {data: result} = useGetFolderById(folderId ?? 'root');

    useEffect(() => {
        const currentFolder = result?.folder;
        if (!currentFolder) return;

        const folderRows: Row[] = (currentFolder.children ?? []).map(f => ({
            id: f.id,
            name: f.name,
            type: 'folder'
        }));

        const fileRows: Row[] = (currentFolder.files ?? []).map(file => ({
            id: file.id,
            name: file.name,
            type: 'file',
            updatedAt: file.updatedAt,
            userName: file.userName,
            version: file.version,
            comment: file.comment,
            size: file.size,
        }));

        setData([...folderRows, ...fileRows]);
    }, [result]);


    const columns = [
        columnHelper.accessor('name', {
            header: () => <>Name</>,
            cell: info => {
                const row = info.row.original;
                return (
                    <div className={'flex items-center gap-2'}>
                        {row.type === 'folder' ? <IoFolderOutline/> : <GoFile/>} {row.name}
                    </div>
                );
            },
        }),
        columnHelper.accessor('updatedAt', {
            header: () => <>Änderungsdatum</>
        }),
        columnHelper.accessor('userName', {
            header: () => <>Geändert von</>
        }),
        columnHelper.accessor('version', {
            header: () => <>Version</>
        }),
        columnHelper.accessor('comment', {
            header: () => <>Kommentar</>
        }),
        columnHelper.accessor('downloads', {
            header: () => <>Downloads</>
        }),
        columnHelper.accessor('size', {
            header: () => <>Grösse</>
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map(row => {
                    const item = row.original;
                    const isFolder = item.type === "folder";
                    const Cells = () =>
                        row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))

                    return (
                        isFolder ? (
                            <FolderContextMenu key={row.id}>
                                <TableRow
                                    className={'cursor-pointer select-none'}
                                    onDoubleClick={() => pushFolder({id: item.id, name: item.name})}
                                >
                                    {Cells()}
                                </TableRow>
                            </FolderContextMenu>
                        ) : (
                            <FileContextMenu key={row.id}>
                                <TableRow
                                    className={'cursor-pointer select-none'}
                                    onDoubleClick={() => {
                                        // folder actions
                                    }}
                                >
                                    {Cells()}
                                </TableRow>
                            </FileContextMenu>
                        )
                    );
                })}
            </TableBody>
        </Table>
    );
}