import { createColumnHelper } from "@tanstack/react-table";
import type { WeaponWithBaseData } from "../lib/api/weaponsInterfaces";

const columnHelper = createColumnHelper<WeaponWithBaseData>();

export const weaponColumns = (onDelete?: (weaponID: number) => void) => [
    columnHelper.accessor('icon', {
        id: 'icon',
        header: '',
        cell: (info) => (
        <img src={`/images/weapons/${info.getValue()}`} alt={info.row.original.name} className="dataIcon" />
    ),
    enableSorting: false,
    size: 30,
    }),

    columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 200
    }),

    columnHelper.accessor('weaponType', {
        id: 'weaponType',
        header: 'Type',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 120
    }),

    columnHelper.accessor('ascension', {
        id: 'ascension',
        header: 'Ascension',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 100
    }),

    columnHelper.accessor('refinement', {
        id: 'refinement',
        header: 'Refinement',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 100
    }),

    columnHelper.accessor('substatType', {
        id: 'substatType',
        header: 'Substat',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 150
    }),


    columnHelper.accessor('level', {
        id: 'level',
        header: 'Level',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 80
    }),

    columnHelper.accessor('rarity', {
        id: 'rarity',
        header: 'Rarity',
        cell: (info) => {
            const rarity = parseInt(info.getValue().toString());
            return (
                <span className="rarityStars">{'★'.repeat(rarity)}</span>
            )
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
            const a = parseInt(rowA.original.rarity.toString());
            const b = parseInt(rowB.original.rarity.toString());
            return a-b;
        },
        size: 100,
    }),

    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
            <button className="deleteButton" onClick={(e) => {
                e.stopPropagation();
                onDelete?.(info.row.original.weaponID);
            }}>
                x
            </button>
        ),
        size: 50
    })
];