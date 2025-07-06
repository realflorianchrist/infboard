'use client'
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@workspace/ui/components/table";
import {useState} from "react";

type Columns = {
    name: string;
    updatedAt?: string;
    userName?: string;
    version: number;
    comment?: string;
    downloads?: string;
    size?: number;
    // meta?: string[];
}

const columnHelper = createColumnHelper<Columns>()

const columns = [
    columnHelper.accessor('name', {
        header: () => <>Name</>,
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

export default function DataTable() {
    const [data, _setData] = useState<Columns[]>([]);

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
                {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}