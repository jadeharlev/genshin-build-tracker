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
        <div>
            <h1>Welcome back, {user?.accountName}.</h1>
            <div style={{
                marginTop: '3rem',
                backgroundColor: '#1a1a1a',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid #444'
                }}>
                <h2 style={{color: "#646cff", marginBottom: '1.5rem'}}>Your Profile</h2>
                <div style={{display: 'grid', gap: '1rem', fontSize: '1.1rem'}}>
                    <div style={{ display: 'flex', gap: '0.5rem'}}>
                        <strong>Email:</strong>
                        <span>{user?.email}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem'}}>
                        <strong>Adventure Rank:</strong>
                        <span>{user?.adventureRank}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem'}}>
                        <strong>Account Name:</strong>
                        <span>{user?.accountName}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}