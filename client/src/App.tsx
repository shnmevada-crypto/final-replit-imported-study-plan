import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/Landing";

// Optional: redirect unauthenticated users to "/" if they try a protected route
function ProtectedRoute({ component: Component, ...props }: any) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Or render a spinner
  return isAuthenticated ? <Component {...props} /> : <Redirect to="/" />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Loading your study dashboard...
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public route for unauthenticated users */}
      {!isAuthenticated && <Route path="/" component={Landing} />}

      {/* Authenticated routes */}
      {isAuthenticated && (
        <>
          <Route path="/" component={Dashboard} />
          {/* Add additional authenticated routes here */}
          {/* Example: <Route path="/study-plan" component={StudyPlan} /> */}
        </>
      )}

      {/* Catch-all route for GitHub Pages SPA */}
      <Route path="*">
        {isAuthenticated ? <Dashboard /> : <Landing />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
