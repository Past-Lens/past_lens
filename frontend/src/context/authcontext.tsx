//auth context.tsx
import { createContext, useContext, type ReactNode } from 'react';
import useUserStore from '../stores/userStore';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user?: any, remember?: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // read/write from Zustand store
    const isAuthenticated = useUserStore((s) => s.isAuthenticated);
    const loginFn = useUserStore((s) => s.login);
    const logoutFn = useUserStore((s) => s.logout);

    const login = (user?: any, remember = true) => {
        if (user) loginFn(user, remember);
        else loginFn({} as any, remember);
    };

    const logout = () => {
        logoutFn();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
