import { useState } from "react";
import type { CharacterWithBaseData } from "../lib/api/charactersInterfaces";
import { flexRender, getCoreRowModel, getSortedRowModel, type SortingState, useReactTable } from "@tanstack/react-table";
import { characterColumns } from "./columns";

interface CharactersTableProps {
    characters: CharacterWithBaseData[];
    onRowClick?: (character: CharacterWithBaseData) => void;
}

export function CharactersTable({characters, onRowClick}: CharactersTableProps) {
    const [sorting, setStorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: characters,
        columns: characterColumns,
        state: {
            sorting
        },
        onSortingChange: setStorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    if(characters.length == 0) {
        return (
            <div className="emptyState">
                <div className="emptyStateIcon">-</div>
                <h2 className="emptyStateTitle">No characters found.</h2>
                <p className="emptyStateMessage">
                    Try adjusting your filters or create a new character!
                </p>
            </div>
        );
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
                                    <th key={header.id} className={canSort ? 'sortable' : ''} onClick={header.column.getToggleSortingHandler()} style={{width: header.getSize()}}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {canSort && (
                                            <span className={`sortIndicator ${sortDirection ? 'active' : ''}`}>
                                                {sortDirection === 'asc' ? '↑' :
                                                sortDirection == 'desc' ? '↓' : '↕'}
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
                        <tr key={row.id} onClick={(() => onRowClick?.(row.original))}>
                            {row.getVisibleCells().map((cell) => {
                                const meta = cell.column.columnDef.meta as { className?: string }

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