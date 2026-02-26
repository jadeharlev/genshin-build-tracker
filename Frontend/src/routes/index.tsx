import {createFileRoute, useNavigate} from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { statsAPI } from "../lib/api/statsAPI";
import { useQuery } from "@tanstack/react-query";
import type { RarityStat } from "../lib/api/statsInterfaces";

export const Route = createFileRoute("/")({
    component: Index
});

function Index() {
    const {isAuthenticated, user, isLoading} = useAuth();

    const {
        data: levelStats,
        isLoading: levelStatsLoading,
    } = useQuery({
        queryKey: ['levelstats'],
        queryFn: statsAPI.getLevelStats
    });

    const {
        data: rarityStats,
        isLoading: rarityStatsLoading,
    } = useQuery({
        queryKey: ['raritystats'],
        queryFn: statsAPI.getRarityStats
    });

    const navigate = useNavigate();
    if(isLoading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
        }}>
            <div style={{fontSize: '1.2rem'}}>Loading...</div>
            </div>;
    }

    if(!isAuthenticated) {
        navigate({to: '/login'});
        return null;
    }

    return (
        <div className="homePageContent">
            <h1 className="pageHeader">Welcome back, {user?.accountName}!</h1>
            <div className="homePageCards">
                <div className="homePageCard">
                    <h2 className="homePageCardHeader">Your Profile</h2>
                    <div className="homePageCardBody">
                        <div className="homePageCardRow">
                            <strong>Email:</strong>
                            <span>{user?.email}</span>
                        </div>
                        <div className="homePageCardRow">
                            <strong>Adventure Rank:</strong>
                            <span>{user?.adventureRank}</span>
                        </div>
                        <div className="homePageCardRow">
                            <strong>Account Name:</strong>
                            <span>{user?.accountName}</span>
                        </div>
                    </div>
                </div>
                {!levelStatsLoading && !rarityStatsLoading ? (
                    <>
                    <div className="homePageCard">
                    <h2 className="homePageCardHeader">Global Level Stats</h2>
                    <div className="homePageCardBody">
                        <div className="homePageCardRow">
                            <strong>Average Character Level:</strong>
                            <span>{levelStats?.averageCharacterLevel}</span>
                        </div>
                        <div className="homePageCardRow">
                            <strong>Average Artifact Level:</strong>
                            <span>{levelStats?.averageArtifactLevel}</span>
                        </div>
                        <div className="homePageCardRow">
                            <strong>Average Weapon Level:</strong>
                            <span>{levelStats?.averageWeaponLevel}</span>
                        </div>
                    </div>
                </div>
                <div className="homePageCard">
                    <h2 className="homePageCardHeader">Global Rarity Stats</h2>
                    <div className="homePageCardBody">
                        {rarityStats?.map((rarityStat: RarityStat) => (
                            <div className="homePageCardRow">
                                <strong>Number of {rarityStat?.rarity}★ Characters:</strong>
                                <span>{rarityStat?.numberOfCharacters}</span>
                            </div>
                        ))}
                    </div>
                </div>
                </>
                ) : null}
            </div>
        </div>
    )
}