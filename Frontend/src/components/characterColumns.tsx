import { createColumnHelper } from "@tanstack/react-table";
import type { CharacterWithBaseData } from "../lib/api/charactersInterfaces";

const columnHelper = createColumnHelper<CharacterWithBaseData>();

export const characterColumns = [
    columnHelper.accessor('icon', {
        id: 'icon',
        header: '',
        cell: (info) => (
        <img src={`/images/characters/${info.getValue()}`} alt={info.row.original.name} className="dataIcon" />
    ),
    enableSorting: false,
    size: 30,
    }),

    columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 170
    }),

    columnHelper.accessor('element', {
        id: 'element',
        header: 'Element',
        cell: (info) => {
            const element = info.getValue();
            return (
                <span>{element}</span>
            );
        },
        enableSorting: true,
        size: 100
    }),

    columnHelper.accessor('rarity', {
        id: 'rarity',
        header: 'Rarity',
        cell: (info) => {
            const rarity = parseInt(info.getValue());
            return (
                <span className="rarityStars">{'★'.repeat(rarity)}</span>
            )
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
            const a = parseInt(rowA.original.rarity);
            const b = parseInt(rowB.original.rarity);
            return a-b;
        },
        size: 100,
    }),

    columnHelper.accessor('weaponType', {
        id: 'weaponType',
        header: 'Weapon',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 80,
    }),

    columnHelper.accessor('ascension', {
        id: 'ascension',
        header: 'Ascension',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 100
    }),

    columnHelper.accessor('talentLevel1', {
        id: 'talentLevel1',
        header: 'Talent 1',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 80,
        meta: {
            className: "hideMobile"
        }
    }),

    columnHelper.accessor('talentLevel2', {
        id: 'talentLevel2',
        header: 'Talent 2',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 80,
        meta: {
            className: "hideMobile"
        }
    }),

    columnHelper.accessor('talentLevel3', {
        id: 'talentLevel3',
        header: 'Talent 3',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 80,
        meta: {
            className: "hideMobile"
        }
    }),

    columnHelper.accessor('constellationLevel', {
        id: 'constellationLevel',
        header: 'Constellation',
        cell: (info) => (
            <span>C{info.getValue()}</span>
        ),
        enableSorting: true,
        size: 40
    })
]