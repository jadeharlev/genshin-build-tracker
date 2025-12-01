import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import type { ArtifactWithSetData } from "../lib/api/artifactsInterfaces";
import { artifactColumns } from "./artifactColumns";

interface ArtifactsTableProps {
    artifacts: ArtifactWithSetData[];
    onRowClick?: (artifact: ArtifactWithSetData) => void;
    onDelete?: (artifactId: number) => void;
}

export function ArtifactsTable({artifacts, onRowClick, onDelete}: ArtifactsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const columns = artifactColumns(onDelete);
    const table = useReactTable({
        data: artifacts,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    if(artifacts.length === 0) {
        return (
            <div className="emptyState">
                <div className="emptyStateIcon">-</div>
                <h2 className="emptyStateTitle">No artifacts found.</h2>
            </div>
        )
    }

    return (
        <div className="charactersTableContainer">
            <table className="charactersTable">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const canSort = header.column.getCanSort();
                                const sortDirection = header.column.getIsSorted();

                                return (
                                    <th
                                    key={header.id}
                                    className={canSort ? 'sortable' : ''}
                                    onClick={header.column.getToggleSortingHandler()}
                                    style={{width: header.getSize()}}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {canSort && (
                                            <span className={`sortIndicator ${sortDirection ? 'active' : ''}`}>
                                                {sortDirection === 'asc' ? '↑' :
                                                sortDirection === 'desc' ? '↓' :
                                                '↕'}
                                            </span>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} onClick={() => onRowClick?.(row.original)}>
                            {row.getVisibleCells().map((cell) => {
                                const meta = cell.column.columnDef.meta as {
                                    className?: string}

                                return (
                                    <td key={cell.id} className={meta?.className}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}