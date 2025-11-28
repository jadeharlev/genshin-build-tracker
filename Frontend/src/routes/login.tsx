import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../lib/api/api";

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isNewUser, setIsNewUser] = useState(false);
    const [googleToken, setGoogleToken ] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        adventureRank: '',
        accountName: ''
    });

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if(!credentialResponse.credential) {
            toast.error("Failed to retrieve Google credential.");
            return;
        }

        try {
            const response = await authApi.googleSignIn({
                idToken: credentialResponse.credential
            });

            // will be in catch if user does not exist; user exists here
            login(response.accessToken, response.refreshToken, response.user);
            toast.success(`Welcome back, ${response.user.displayName}!`);
            navigate({to: "/"});
        } catch(error: any) {
            let isNewUser: boolean = (error.response?.status == 400 && error.response?.data?.isNewUser);
            if(isNewUser) {
                setIsNewUser(true);
                setGoogleToken(credentialResponse.credential);
                toast.success("Welcome! Please complete your profile.");
            } else {
                toast.error("Google sign in failed.");
                console.error("Google sign in error:", error);
            }
        }
    };

    const handleGoogleError = () => {
        toast.error("Google sign in was unsuccessful. Please try again.");
    }

    const handleNewUserSubmission = async (formEvent: React.FormEvent) => {
        formEvent.preventDefault();
        if(!googleToken) {
            toast.error("Missing Google token. Please try signing in again.");
            return;
        }

        const adventureRank = parseInt(formData.adventureRank);
        if(isNaN(adventureRank) || adventureRank < 1 || adventureRank > 60) {
            toast.error('Please enter a valid Adventure Rank (1-60).');
            return;
        }

        if(!formData.accountName.trim()) {
            toast.error('Please enter an account name.');
            return;
        }

        try {
            const response = await authApi.googleSignIn({
                idToken: googleToken,
                adventureRank,
                accountName: formData.accountName.trim()
            });

            login(response.accessToken, response.refreshToken, response.user);
            toast.success(`Welcome, ${response.user.displayName}!`)
            navigate({to: '/'});
        } catch(error) {
            toast.error("Failed to complete user sign up.");
            console.error("New user sign up error:", error);
        }
    };


    return (
        <div className="loginPageContent">
            <h1 className="pageHeader">Welcome!</h1>
            {!isNewUser ? (
                <div className="loginCard">
                    <p>Sign in with Google to get started!</p>
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
                </div>
            ) : (
                <div style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '2rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                <form onSubmit={handleNewUserSubmission}>
                    // TODO restyle these
                    <h2 style={{marginBottom: '2rem', textAlign: 'center', color: '#646cff'}}>Complete Your Profile</h2>
                    <div style={{marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <label style={{fontWeight: '500', fontSize: '1rem'}}>
                            Adventure Rank:
                        </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={formData.adventureRank}
                                onChange={(e) => setFormData({...formData, adventureRank: e.target.value})}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter your adventure rank (1-60)."
                            />
                    </div>

                    <div style={{
                        marginBottom: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                        }}>
                        <label style={{fontWeight: '500', fontSize: '1rem'}}>
                            Account Name:
                        </label>
                            <input
                                type="text"
                                value={formData.accountName}
                                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                                required
                                maxLength={255}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter your account name."
                            />
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '0.875rem',
                        backgroundColor: '#646cff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        transition: 'background-color 0.25s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#535bf2'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#646cff'}
                    >Complete Sign Up</button>
                    </form>
                </div>
            )}
        </div>
    )
}