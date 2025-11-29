import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Generator from "./components/Generator";
import OnboardingComponent from "./components/Onboarding";
import Nav from "./components/nav-bar";

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
    apiDomain: "http://localhost:9090",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
});

function App() {
  return (
    <SuperTokensWrapper>
      <BrowserRouter>
        <Routes>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
            EmailPasswordPreBuiltUI,
          ])}

          <Route
            element={
              <SessionAuth>
                <QueryClientProvider client={queryClient}>
                  <Toaster position="bottom-right" reverseOrder={false} />
                  <Nav />
                  <Outlet />
                </QueryClientProvider>
              </SessionAuth>
            }
          >
            <Route path="/" element={<Generator />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/onboarding" element={<OnboardingComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SuperTokensWrapper>
  );
}

export default App;
