import { AccountInfo } from '@azure/msal-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { getProfile, handleRedirect, isLoggedIn } from './util';
import { getMsalApp } from './util/msal-config';

const { uniqueId } = getProfile();
if (!isLoggedIn() && !!uniqueId) {
  const msalApp = getMsalApp();
  const account = msalApp.getAccountByLocalId(uniqueId) as AccountInfo & { idTokenClaims: { exp: number } };
  if (!!account && account.idTokenClaims.exp * 1000 > new Date().getTime()) {
    msalApp.setActiveAccount(account);
  }
}

handleRedirect(renderApp);

function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <HelmetProvider>
        <Router>
          <App />
        </Router>
      </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
