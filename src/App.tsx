import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { AppRoutes } from "@/routes";

function App() {
  return (
    <AuthBootstrap>
      <AppRoutes />
    </AuthBootstrap>
  );
}

export default App;
