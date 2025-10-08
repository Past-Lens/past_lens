import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type User = {
    id?: string;
    user_name?: string;
    user_email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
};

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (u: User | null) => void;
    setTokens: (accessToken?: string, refreshToken?: string) => void;
    login: (u: User, remember?: boolean) => void;
    logout: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set: any, get: any) => ({
            user: null,
            // compute initial auth from persisted Zustand snapshot if present
            isAuthenticated: (() => {
                const user = get()?.user;
                return !!user;
            })(),
            setUser: (u: User | null) => set({ user: u, isAuthenticated: !!u }),
            setTokens: (accessToken?: string, refreshToken?: string) =>
                set((state: UserState) => ({
                    user: {
                        ...(state.user ?? {}),
                        accessToken,
                        refreshToken,
                    } as User,
                })),
            login: (u: User, remember = true) => {
                set({ user: u, isAuthenticated: true });
                try {
                    if (remember)
                        localStorage.setItem('isAuthenticated', 'true');
                    else localStorage.removeItem('isAuthenticated');
                } catch (e) {
                    /* ignore localStorage errors */
                }
            },
            logout: () => {
                set({ user: null, isAuthenticated: false });
                try {
                    localStorage.setItem('isAuthenticated', 'false');
                } catch (e) {
                    /* ignore localStorage errors */
                }
            },
        }),
        {
            name: 'user-store',
            // use a simple any-typed storage wrapper to satisfy persist generics
            storage: createJSONStorage(() => localStorage),
        }
    ) as any
);

export default useUserStore;
