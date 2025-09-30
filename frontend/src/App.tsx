import AppRouter from './router.tsx';
import { AuthProvider } from './context/authcontext.tsx';
import { ThemeProvider } from './context/themecontext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
