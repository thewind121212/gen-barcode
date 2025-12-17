import Generator from "@Jade/components/Generator";
import OnboardingComponent from "@Jade/components/Onboarding";
import Auth from "@Jade/components/auth-moudule/Auth";
import LoadingScreen from "@Jade/components/loading/AppLoader";
import SplashScreen from "@Jade/components/loading/SplashScreen";
import { Sidebar } from "@Jade/components/nav-bar/net";
import CategoryPage from "@Jade/page/Category";
import { store } from '@Jade/store/global.store';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth, useSessionContext } from "supertokens-auth-react/recipe/session";
import type { ReactNode } from "react";


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

function SessionLoadingBoundary({ children }: { children: ReactNode }) {
  const session = useSessionContext();

  if (session.loading) {
    return (
      <SplashScreen>
        <div className="h-[50px]"/>
      </SplashScreen>
    );
  }

  return <>{children}</>;
}

function ProtectedLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';


  return (
    <SessionAuth>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <LoadingScreen />
          {!isOnboarding && <Sidebar
            setActiveTab={() => { }}
            onSignOut={() => { }}
          />}
          <div className={`flex justify-center items-start bg-gray-50 dark:bg-gray-950 h-screen ${isOnboarding ? 'ml-0' : 'ml-20'}`}
          >
            <div className="w-full h-full max-w-7xl p-4 md:p-10 lg:p-15 py-0!">
              <Outlet />
            </div>
          </div>
        </QueryClientProvider>
      </Provider>
    </SessionAuth>
  );
}

function App() {
  return (
    <SuperTokensWrapper>
      <SessionLoadingBoundary>
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
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<CategoryPage />} />
              <Route path="/barcode-generator" element={<Generator />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/categories/:id" element={<CategoryPage />} />
              <Route path="/onboarding" element={<OnboardingComponent />} />
              <Route path="/printer" element={<Generator />} />
              <Route path="/settings" element={<Generator />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionLoadingBoundary>
    </SuperTokensWrapper>
  );
}

export default App;
