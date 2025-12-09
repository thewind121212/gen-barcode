import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Generator from "./components/Generator";
import OnboardingComponent from "./components/Onboarding";
import { Sidebar } from "./components/nav-bar/net";

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
    websiteDomain: "http://localhost:3000",
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
        <Toaster position="bottom-right" reverseOrder={false} />
        {!isOnboarding && <Sidebar
          setActiveTab={() => { }}
          onSignOut={() => { }}
          isSigningOut={false}
        />}
        <div className="ml-20">
          <Outlet />
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
