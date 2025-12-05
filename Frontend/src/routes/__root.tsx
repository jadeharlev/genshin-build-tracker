import { createRootRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createRootRoute({
    component: () => {
        const {user, logout, isAuthenticated} = useAuth();
        const navigate = useNavigate();
        const linkProps = {
            activeProps: {
                className: 'navBarSelectedElement'
            }
        };

        return (
            <>
                <div className="navBarOuterContainer">
                    <div className="navBarInnerContainer">
                        <div className="navBarContainerElementLeft">
                            <Link to="/" {...linkProps} activeOptions={{exact: true}}>Home</Link>
                            {isAuthenticated && (
                                <>
                                    <Link to="/characters" {...linkProps}>Characters</Link>
                                    <Link to="/artifacts" {...linkProps}>Artifacts</Link>
                                    <Link to="/weapons" {...linkProps}>Weapons</Link>
                                    <Link to="/teams" {...linkProps}>Teams</Link>
                                    <Link to="/builds" {...linkProps}>Builds</Link>
                                </>
                            )}
                        </div>

                        {isAuthenticated ? (
                            <div className="navBarContainerElementRight">
                                <span>{user?.accountName}</span>
                                <button onClick={() => {
                                        logout().then(() => {
                                            navigate({
                                                to: "/login",
                                                replace: true
                                            });
                                        })
                                    }}>Log Out</button>
                            </div>
                        ) : (
                            <Link to="/login" {...linkProps}>Log In</Link>
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