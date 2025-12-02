import { type SortingState, useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { useState } from "react";
import type { WeaponWithBaseData } from "../lib/api/weaponsInterfaces";
import { weaponColumns } from "./weaponColumns";

interface WeaponsTableProps {
    weapons: WeaponWithBaseData[];
    onRowClick: (weapon: WeaponWithBaseData) => void;
    onDelete?: (weaponID: number) => void;
}

export function WeaponsTable({weapons, onRowClick, onDelete}: WeaponsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: weapons,
        columns: weaponColumns(onDelete),
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    if(weapons.length == 0) {
        return (
            <div className="emptyState">
                <div className="emptyStateIcon">-</div>
                <h2 className="emptyStateTitle">No weapons found.</h2>
                <p className="emptyStateMessage">
                    Try adjusting your filters or create a new weapon!
                </p>
            </div>
        );
    }

    return (
        <div className="dataTableContainer">
            <table className="dataTable">
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
                        <tr key={row.id} className="dataTableRow" onClick={() => onRowClick(row.original)}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} style={{width: cell.column.getSize()}}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}