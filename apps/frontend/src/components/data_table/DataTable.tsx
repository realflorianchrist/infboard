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
import {IoFolderOutline} from "react-icons/io5";
import {useGetFolderDataById} from "@/src/api/hooks/api_hooks/folderHooks";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
import {Checkbox} from "@workspace/ui/components/checkbox";
import {cn} from "@workspace/ui/lib/utils";
import {useDownloadFile} from "@/src/hooks/useDownloadFile";
import {formatDate, formatFileSize} from "@/src/utils/formatter";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {getFileSymbol} from "@/src/utils/getFileSymbol";
import Loader from "@/src/components/loader/Loader";
import {useDroppable} from "@dnd-kit/core";
import {Data, isFolder} from "@workspace/types";
import FolderRow from "@/src/components/data_table/FolderRow";
import FileRow from "@/src/components/data_table/FileRow";

export type RowData = Data & {
    select?: boolean;
};


export default function DataTable() {
    const {folderId} = useFolderPath();
    const {
        selected,
        isSelected,
        setSelected,
        addSelected,
        removeSelected,
    } = useContextMenu();

    const {isDownloading} = useDownloadFile();

    const columnHelper = createColumnHelper<RowData>();

    const [data, setData] = useState<RowData[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const {data: result, isPending: loadingData} = useGetFolderDataById(folderId);
    const {setNodeRef} = useDroppable({id: folderId});

    useEffect(() => {
        const currentFolder = result?.folder;
        if (!currentFolder) return;

        const folderRows: RowData[] = (currentFolder.children ?? []);

        const fileRows: RowData[] = (currentFolder.files ?? []).map((file) => ({
            ...file,
            updatedAt: formatDate(file.updatedAt),
            size: formatFileSize(file.size),
        }));

        setData([...folderRows, ...fileRows]);
    }, [result]);


    const columns = [
        columnHelper.accessor('select', {
            header: () => {

                const visibleItems = [...(result?.folder.children ?? []), ...(result?.folder.files ?? [])];
                const allSelected = visibleItems.length > 0 && visibleItems.every(i => selected.some(s => s.id === i.id));

                return (
                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                if (result?.folder) setSelected(visibleItems);
                            } else {
                                setSelected([]);
                            }
                        }}
                    />
                )
            },
            cell: (info) => {
                const row = info.row.original;

                const selected = isSelected(row.id);

                return (
                    <Checkbox
                        className={cn(
                            'opacity-0 group-hover:opacity-100 transition-opacity', {
                                'opacity-100': selected
                            }
                        )}
                        checked={selected}
                        onCheckedChange={(checked) => {
                            const folder = result?.folder.children?.find(f => f.id === row.id);
                            const file = result?.folder.files?.find(f => f.id === row.id);

                            if (checked) {
                                if (folder) addSelected(folder);
                                if (file) addSelected(file);
                            } else {
                                removeSelected(row.id);
                            }
                        }}
                    />
                )
            },
            size: 40,
            enableSorting: false,
            enableResizing: false
        }),
        columnHelper.accessor('name', {
            header: () => <span className={'truncate'}>Name</span>,
            cell: (info) => {
                const row = info.row.original;
                return (
                    <div
                        className="flex items-center gap-2 overflow-hidden max-w-full"
                        title={row.name}
                    >
                        <span className="shrink-0">
                            {isFolder(row) ? <IoFolderOutline/> : getFileSymbol(row.contentType)}
                        </span>
                        <span className="truncate whitespace-nowrap">{row.name}</span>
                    </div>
                );
            },
            size: 300,
            minSize: 200,
            maxSize: 400,
        }),
        columnHelper.accessor('updatedAt', {
            header: () => <span className={'truncate'}>Geändert</span>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('userName', {
            header: () => <span className={'truncate'}>Geändert von</span>,
            size: 150,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('version', {
            header: () => <span className={'truncate'}>Version</span>,
            size: 100,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('comment', {
            header: () => <span className={'truncate'}>Kommentar</span>,
            size: 200,
            minSize: 150,
            maxSize: 600,
        }),
        columnHelper.accessor('downloads', {
            header: () => <span className={'truncate'}>Downloads</span>,
            size: 120,
            minSize: 75,
            maxSize: 300,
        }),
        columnHelper.accessor('size', {
            header: () => <span className={'truncate'}>Grösse</span>,
            size: 100,
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
        <>
            {(isDownloading || loadingData) && <Loader isFullScreen={true}/>}

            <div ref={setNodeRef}
                 className={'flex min-h-full min-w-full'}
            >
                <Table className={'table-fixed'}>
                    <TableHeader className={'sticky top-0 z-10 bg-background'}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{width: header.getSize()}}
                                        className={'group relative select-none'}
                                    >
                                        <div className={'flex gap-2 items-center cursor-pointer'}
                                             onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {!header.isPlaceholder && (
                                                <>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    <span className={'w-4 flex justify-center'}>
                                                {
                                                    {
                                                        asc: <FaCaretUp/>,
                                                        desc: <FaCaretDown/>,
                                                    }
                                                        [header.column.getIsSorted() as string] ?? (
                                                        <span className={'invisible'}>
                                                            <FaCaretUp/>
                                                        </span>
                                                    )}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={cn(
                                                    "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-border",
                                                    "transition-opacity opacity-0 group-hover:opacity-100"
                                                )}
                                            />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map(row => {
                            const item = row.original;
                            const Cells = () =>
                                row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))

                            const rowClassNames = cn('cursor-pointer select-none group', {
                                'bg-accent/10 hover:bg-accent/20': isSelected(item.id),
                                'opacity-50': item.deleted
                            });

                            return (
                                isFolder(item) ? (
                                    <FolderRow
                                        key={row.id}
                                        folder={item}
                                        className={rowClassNames}
                                    >
                                        {Cells()}
                                    </FolderRow>
                                ) : (
                                    <FileRow
                                        key={row.id}
                                        file={item}
                                        className={rowClassNames}
                                    >
                                        {Cells()}
                                    </FileRow>
                                )
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}