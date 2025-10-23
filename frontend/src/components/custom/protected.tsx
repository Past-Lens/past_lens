import { useAuth } from '@/context/authcontext';
import { useEffect, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

function Protected({ children }: { children: ReactElement }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // while Zustand persist hydrates, read the persisted store snapshot (if available)
    const persisted = (() => {
        if (typeof window === 'undefined') return null;
        try {
            const raw = localStorage.getItem('user-store');
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            // Persisted shape may be { state: { user: {...}, isAuthenticated: true }, ... }
            if (parsed && parsed.state) return parsed.state;
            return parsed;
        } catch (e) {
            return null;
        }
    })();

    const persistedAuth = Boolean(
        persisted && (persisted.isAuthenticated || persisted.user != null)
    );

    useEffect(() => {
        // only redirect to /login when we are sure the user is not authenticated
        if (!isAuthenticated && !persistedAuth) {
            navigate('/login');
        }
    }, [isAuthenticated, persistedAuth, navigate]);

    return <>{children}</>;
}

export default Protected;
