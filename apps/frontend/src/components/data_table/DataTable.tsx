'use client'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@workspace/ui/components/table";
import {useEffect, useState} from "react";
import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {IoFolderOutline} from "react-icons/io5";
import {GoFile} from "react-icons/go";
import {useGetFolderDataById} from "@/src/api/hooks/folderHooks";
import DataContextMenu from "@/src/components/context_menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {cn} from "@workspace/ui/lib/utils";
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
import {ScrollArea} from "@workspace/ui/components/scroll-area";

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
    const {
        openNewFolderModal,
        openRenameFolderModal,
        openDeleteFolderModal,
        openDeleteFileModal,
        setIsSelectMode,
        addSelected,
        openUploadFileModal,
        openRenameFileModal,
    } = useContextMenu();

    const columnHelper = createColumnHelper<Row>();

    const [data, setData] = useState<Row[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const folderId = path?.[path.length - 1]?.id;
    const {data: result} = useGetFolderDataById(folderId ?? 'root');

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
            size: 400,
            minSize: 200,
            maxSize: 600,
        }),
        columnHelper.accessor('updatedAt', {
            header: () => <>Änderungsdatum</>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('userName', {
            header: () => <>Geändert von</>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('version', {
            header: () => <>Version</>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('comment', {
            header: () => <>Kommentar</>,
            size: 300,
            minSize: 150,
            maxSize: 600,
        }),
        columnHelper.accessor('downloads', {
            header: () => <>Downloads</>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('size', {
            header: () => <>Grösse</>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
        columnResizeMode: 'onChange',
        // enableColumnResizing: true,
    });

    return (
        <Table>
            <TableHeader className={'sticky top-0 z-10 bg-background'}>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <TableHead
                                key={header.id}
                                style={{width: header.getSize()}}
                                onClick={header.column.getToggleSortingHandler()}
                                className={"relative group select-none cursor-pointer"}
                            >
                                <div className="flex gap-2 items-center">
                                    {!header.isPlaceholder && (
                                        <>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <span className="w-4 flex justify-center">
                                                {{
                                                        asc: <FaCaretUp/>,
                                                        desc: <FaCaretDown/>,
                                                    }[header.column.getIsSorted() as string] ??
                                                    <span className="invisible"><FaCaretUp/></span>
                                                }
                                            </span>
                                        </>
                                    )}
                                </div>
                                {/*{header.column.getCanResize() && (*/}
                                {/*    <div*/}
                                {/*        onMouseDown={header.getResizeHandler()}*/}
                                {/*        onTouchStart={header.getResizeHandler()}*/}
                                {/*        className={cn("absolute right-0 top-0 h-full w-1 cursor-col-resize bg-border",*/}
                                {/*            "transition-opacity opacity-0 group-hover:opacity-100")}*/}
                                {/*    />*/}
                                {/*)}*/}
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
                            <DataContextMenu
                                key={row.id}
                                onNewFolder={() => openNewFolderModal(item.id)}
                                onRename={() => openRenameFolderModal(item.id, item.name)}
                                onDelete={() => openDeleteFolderModal(item.id)}
                                onSelect={() => {
                                    setIsSelectMode(true)
                                    const folder = result?.folder.children?.find(f => f.id === item.id);
                                    if (folder) addSelected(folder);
                                }}
                                onUploadFile={() => openUploadFileModal(item.id)}
                            >
                                <TableRow
                                    className={'cursor-pointer select-none'}
                                    onDoubleClick={() => pushFolder({id: item.id, name: item.name})}
                                >
                                    {Cells()}
                                </TableRow>
                            </DataContextMenu>
                        ) : (
                            <DataContextMenu
                                key={row.id}
                                onRename={() => openRenameFileModal(item.id, item.name)}
                                onDelete={() => openDeleteFileModal(item.id)}
                                onSelect={() => {
                                    setIsSelectMode(true);
                                    const file = result?.folder.files?.find(f => f.id === item.id);
                                    if (file) addSelected(file);
                                }}
                            >
                                <TableRow
                                    className={'cursor-pointer select-none'}
                                >
                                    {Cells()}
                                </TableRow>
                            </DataContextMenu>
                        )
                    );
                })}
            </TableBody>
        </Table>
    );
}