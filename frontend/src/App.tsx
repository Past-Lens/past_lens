import AppRouter from "./router.tsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authcontext.tsx";

function App() {

  return (
    <>
      <AppRouter/>
    </>
  );
}

export default App;
