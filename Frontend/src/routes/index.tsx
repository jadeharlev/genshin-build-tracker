import {createFileRoute, useNavigate} from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createFileRoute("/")({
    component: Index,
    beforeLoad: ({}) => {
        //TODO
    }
});

function Index() {
    const {isAuthenticated, user, isLoading} = useAuth();
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
        </div>
    )
}