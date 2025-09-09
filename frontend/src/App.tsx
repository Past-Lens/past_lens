import AppRouter from "./router.tsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authcontext.tsx";

function App() {
  return (
    <>
      <AuthProvider>
        {/* We are now using the AppRouter component for all routing */}
        <AppRouter />
      </AuthProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
