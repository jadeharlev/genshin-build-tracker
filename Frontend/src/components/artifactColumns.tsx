import { createColumnHelper } from "@tanstack/react-table";
import type { ArtifactStat, ArtifactWithSetData } from "../lib/api/artifactsInterfaces";

const columnHelper = createColumnHelper<ArtifactWithSetData>();

const formatStat = (stat: ArtifactStat | null): string => {
    if(!stat) return "-";
    return `${stat.value} ${stat.statType}`;
}

export const artifactColumns = (onDelete?: (artifactId: number) => void) => [
    columnHelper.accessor('icon', {
        id: 'icon',
        header: '',
        cell: (info) => (
            <img src={`/images/artifacts/${info.getValue()}`}
            alt={info.row.original.setName}
            className="dataIcon" />
        ),
        enableSorting: false,
        size: 60,
    }),

    columnHelper.accessor('setName', {
        id: 'setName',
        header: 'Set',
        cell: (info) => <span>{info.getValue()}</span>,
        enableSorting: true,
        size: 180,
    }),

    columnHelper.accessor('rarity', {
        id: 'rarity',
        header: 'Rarity',
        cell: (info) => {
            const rarity = info.getValue();
            return <span className="rarityStars">{'★'.repeat(rarity)}</span>
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
            return rowA.original.rarity - rowB.original.rarity;
        },
        size: 80
    }),

    columnHelper.accessor('level', {
        id: 'level',
        header: 'Level',
        cell: (info) => <span>+{info.getValue()}</span>,
        enableSorting: true,
        size: 70,
    }),

    columnHelper.accessor('mainStatType', {
        id: 'mainStatType',
        header: 'Main Stat',
        cell: (info) => <span className="mainStatBadge">{info.getValue()}</span>,
        enableSorting: true,
        size: 100,
    }),

    columnHelper.accessor('firstStat', {
        id: 'firstStat',
        header: 'Substat',
        cell: (info) => <span className="substatCell">{formatStat(info.getValue())}</span>,
        enableSorting: false,
        size: 100
    }),

    columnHelper.accessor('secondStat', {
        id: 'secondStat',
        header: 'Substat',
        cell: (info) => <span className="substatCell">{formatStat(info.getValue())}</span>,
        enableSorting: false,
        size: 100
    }),

    columnHelper.accessor('thirdStat', {
        id: 'thirdStat',
        header: 'Substat',
        cell: (info) => <span className="substatCell">{formatStat(info.getValue())}</span>,
        enableSorting: false,
        size: 100
    }),

    columnHelper.accessor('fourthStat', {
        id: 'fourthStat',
        header: 'Substat',
        cell: (info) => <span className="substatCell">{formatStat(info.getValue())}</span>,
        enableSorting: false,
        size: 100
    }),

    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
            <button className="deleteButton" onClick={(e) => {
                e.stopPropagation();
                onDelete?.(info.row.original.artifactId);
            }}>
                x
            </button>
        ),
        size: 50
    })
]