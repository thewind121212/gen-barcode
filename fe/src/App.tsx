import './App.css'
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth, signOut } from "supertokens-auth-react/recipe/session";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Generator from './components/Generator';

import * as reactRouterDom from "react-router-dom";


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
  const handlerSignOut = async () => {
    await signOut();
    window.location.href = "/auth";
  }

  return (
    <SuperTokensWrapper>
      <BrowserRouter>
        <Routes>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [EmailPasswordPreBuiltUI])}

          <Route path="/" element={
            <SessionAuth>
              <div className="App">
                <h2 onClick={handlerSignOut} style={{ cursor: 'pointer' }}>Log out</h2>
              </div>
              <Generator />
            </SessionAuth>
          } />
        </Routes>
      </BrowserRouter>
    </SuperTokensWrapper>
  )
}

export default App
