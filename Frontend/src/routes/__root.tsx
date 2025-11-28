import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createRootRoute({
    component: () => {
        const {user, logout, isAuthenticated} = useAuth();

        return (
            <>
                <div className="navBarOuterContainer">
                    <div className="navBarInnerContainer">
                        <div className="navBarContainerElementLeft">
                            {/* TODO configure navBarSelectedElement appropriately */}
                            <Link to="/" className="navBarSelectedElement">Home</Link>
                            {isAuthenticated && (
                                <>
                                    <Link to="/characters">Characters</Link>
                                    <Link to="/artifacts">Artifacts</Link>
                                    <Link to="/builds">Builds</Link>
                                    <Link to="/teams">Teams</Link>
                                </>
                            )}
                        </div>

                        {isAuthenticated ? (
                            <div className="navBarContainerElementRight">
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