import AppRouter from "./router.tsx";
import { AuthProvider } from "./context/authcontext.tsx";
import { ThemeProvider } from "./context/themecontext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
