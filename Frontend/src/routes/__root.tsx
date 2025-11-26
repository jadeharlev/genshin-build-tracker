import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createRootRoute({
    component: () => {
        const {user, logout, isAuthenticated} = useAuth();

        return (
            <>
                <div style={{ padding: '1rem', borderBottom: '1px solid #ccc'}}>
                    <div style={{
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem'}}>Home</Link>
                            {isAuthenticated && (
                                <>
                                    <Link to="/characters">Characters</Link>
                                    <Link to="/builds">Builds</Link>
                                    <Link to="/teams">Teams</Link>
                                </>
                            )}
                        </div>

                        {isAuthenticated ? (
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <span>{user?.accountName}</span>
                                <button onClick={() => logout()}>Log Out</button>
                            </div>
                        ) : (
                            <Link to="/login">Log In</Link>
                        )}
                    </div>
                </div>
                <div style={{padding: '2rem', margin: '0 auto'}}>
                    <Outlet />
                </div>
            </>
        )
    }
});