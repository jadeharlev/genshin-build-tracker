import { createFileRoute } from '@tanstack/react-router'
import { gameDataApi } from '../lib/api/gameDataAPI';
import { weaponsApi } from '../lib/api/weaponsAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { Weapon, WeaponType, WeaponWithBaseData } from '../lib/api/weaponsInterfaces';
import type { BaseWeapon } from '../lib/api/gameDataAPIInterfaces';
import { toast } from 'react-hot-toast';
import { WeaponsFilterBar } from '../components/WeaponsFilterBar';
import { WeaponsTable } from '../components/WeaponsTable';
import { AddWeaponModal } from '../components/AddModals/AddWeaponModal';

export const Route = createFileRoute('/weapons')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        data: weapons,
        isLoading: weaponsLoading,
        isError: weaponsError
    } = useQuery({
        queryKey: ['weapons'],
        queryFn: weaponsApi.getAll
    });

    const {
        data: baseWeapons,
        isLoading: baseWeaponsLoading,
    } = useQuery({
        queryKey: ['baseWeapons'],
        queryFn: gameDataApi.getAllWeapons
    });

    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
    const [modalIsOpen, setModalOpen] = useState(false);

    const combinedWeapons = useMemo(() => {
        if(!weapons || !baseWeapons) return [];

        const baseWeaponMap = new Map<string, BaseWeapon>(
            baseWeapons.map((baseWeapon: BaseWeapon) => [baseWeapon.key, baseWeapon])
        );

        return weapons.map((weapon: Weapon) => {
            const baseWeapon = baseWeaponMap.get(weapon.baseWeaponKey);
            let returnValue = weapon as WeaponWithBaseData;
            returnValue.name = baseWeapon?.name ?? "Unknown";
            returnValue.weaponType = baseWeapon?.weaponType as WeaponType;
            returnValue.rarity = baseWeapon?.rarity ?? 1;
            returnValue.substatType = baseWeapon?.substatType ?? "Unknown";
            returnValue.substatValue = baseWeapon?.substatValue ?? 0;
            returnValue.icon = baseWeapon?.icon ?? "";
            return returnValue;
        });
    }, [weapons, baseWeapons]);

    const createWeaponMutation = useMutation({
        mutationFn: weaponsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['weapons'] });
            setModalOpen(false);
            toast.success('Weapon added successfully');
        },
        onError: (error) => {
            console.error("Failed to add weapon:", error);
            toast.error('Failed to add weapon');
        }
    });

    const handleCreateClick = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleCreateWeapon = (data: Weapon) => {
        createWeaponMutation.mutate(data);
    };

    const handleRarityToggle = (rarity: number) => {
        setSelectedRarities((previous) =>
            previous.includes(rarity)
            ? previous.filter((r) => r !== rarity)
            : [...previous, rarity]
        );
    }

    const handleTypeToggle = (weaponType: WeaponType) => {
        setSelectedTypes((previous) =>
            previous.includes(weaponType)
            ? previous.filter((w) => w !== weaponType)
            : [...previous, weaponType]
        );
    }

    const handleRowClick = (weapon: WeaponWithBaseData) => {
        console.log("Weapon clicked:", weapon);
    }

    const handleDelete = (weaponID: number) => {
        if(window.confirm("Are you sure you want to delete this weapon?")) {
            deleteWeaponMutation.mutate(weaponID);
        }
    };

    const filteredWeapons = useMemo(() => {
        return combinedWeapons.filter((weapon) => {
            if(searchQuery && !weapon.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if(selectedTypes.length > 0 && !selectedTypes.includes(weapon.weaponType)) return false;
            if(selectedRarities.length > 0 && !selectedRarities.includes(weapon.rarity)) return false;
            return true;
        });
    }, [combinedWeapons, searchQuery, selectedTypes, selectedRarities]);

    const deleteWeaponMutation = useMutation({
            mutationFn: weaponsApi.delete,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['weapons']});
                toast.success('Weapon deleted successfully!');
            },
            onError: () => {
                toast.error('Failed to delete weapon.');
            }
        });

    if (weaponsLoading || baseWeaponsLoading) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Characters</h1>
                <div className="dataTableContainer">
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                    <div className="loadingSkeleton skeletonRow"></div>
                </div>
            </div>
        );
    }

    if (weaponsError) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Weapons</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">Error loading weapons.</h2>
                    <p className="emptyStateMessage">Please try refreshing.</p>
                </div>
            </div>
        )
    }

    if (combinedWeapons.length === 0) {
        return (
            <div className="dataPage">
                <h1 className="dataPageHeader">Weapons</h1>
                <div className="emptyState">
                    <div className="emptyStateIcon">X</div>
                    <h2 className="emptyStateTitle">No weapons yet.</h2>
                    <p className="emptyStateMessage">Create a weapon to get started!</p>
                    <button className="createWeaponButton" onClick={handleCreateClick}>+ Create a Weapon</button>
                </div>
                <AddWeaponModal
                isOpen={modalIsOpen}
                onClose={handleModalClose}
                onSubmit={handleCreateWeapon}
                baseWeapons={baseWeapons || []}
                isSubmitting={createWeaponMutation.isPending}
            />
            </div>
        )
    }

    return (
        <div className="dataPage">
            <h1 className="dataPageHeader">Weapons</h1>
            <WeaponsFilterBar searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                selectedRarities={selectedRarities}
                onRarityToggle={handleRarityToggle}
                onCreateClick={handleCreateClick}
            />
            <WeaponsTable weapons={filteredWeapons} onRowClick={handleRowClick} onDelete={handleDelete} />
            <AddWeaponModal
                isOpen={modalIsOpen}
                onClose={handleModalClose}
                onSubmit={handleCreateWeapon}
                baseWeapons={baseWeapons || []}
                isSubmitting={createWeaponMutation.isPending}
            />
        </div>
    )
}
