import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import { Dashboard } from "@/components/dashboard/Dashboard";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />

      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
