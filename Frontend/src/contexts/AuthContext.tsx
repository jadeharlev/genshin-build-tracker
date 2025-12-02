import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../lib/api/apiInterfaces";
import { authApi } from "../lib/api/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const currentUser = await authApi.getCurrentUser();
                    setUser(currentUser);
                } catch(error) {
                    console.error('Failed to fetch current user', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [])

    const login = (accessToken: string, refreshToken: string, user: User) => {
        queryClient.invalidateQueries();
        queryClient.clear();
        queryClient.resetQueries();
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Failed to logout', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            queryClient.invalidateQueries();
            queryClient.clear();
            queryClient.resetQueries();
        }
    };

    return (
        <AuthContext.Provider value={{user, isLoading, isAuthenticated: !!user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}