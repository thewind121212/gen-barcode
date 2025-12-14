import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Generator from "@Jade/components/Generator";
import OnboardingComponent from "@Jade/components/Onboarding";
import { Sidebar } from "@Jade/components/nav-bar/net";
import CategoryPage from "@Jade/page/Category";

import * as reactRouterDom from "react-router-dom";

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

SuperTokens.init({
  appInfo: {
    appName: "barcode-generator",
    apiDomain: "http://localhost:9190",
    websiteDomain: "http://localhost:4140",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
});

// Layout component that conditionally renders Nav based on route
function ProtectedLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';

  return (
    <SessionAuth>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: `
              [--toast-bg:#ffffff] [--toast-fg:#0f172a] [--toast-border:#e2e8f0]
              dark:[--toast-bg:#0f172a] dark:[--toast-fg:#e2e8f0] dark:[--toast-border:#1f2937]
            `,
            style: {
              background: "var(--toast-bg)",
              color: "var(--toast-fg)",
              border: "1px solid var(--toast-border)",
              boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.15)",
            },
          }}
        />
        {!isOnboarding && <Sidebar
          setActiveTab={() => { }}
          onSignOut={() => { }}
          isSigningOut={false}
        />}
        <div className="ml-20 flex justify-center items-start bg-gray-50 dark:bg-gray-950 h-screen">
          <div className="w-full h-full max-w-7xl p-4 md:p-10 lg:p-15 py-0!">
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
    </SessionAuth>
  );
}

function App() {
  return (
    <SuperTokensWrapper>
      <BrowserRouter>
        <Routes>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
            EmailPasswordPreBuiltUI,
          ])}

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Generator />} />
            <Route path="/barcode-generator" element={<Generator />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/inventory" element={<OnboardingComponent />} />
            <Route path="/printer" element={<Generator />} />
            <Route path="/settings" element={<Generator />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SuperTokensWrapper>
  );
}

export default App;
