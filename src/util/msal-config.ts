import * as msal from '@azure/msal-browser';

const MSAL_CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const MSAL_AUTHORITY = process.env.REACT_APP_AUTHORITY;

let msalApp: msal.PublicClientApplication;

export const loginRequest: msal.RedirectRequest = {
  authority: MSAL_AUTHORITY,
  redirectUri: `${process.env.REACT_APP_URI}/login`,
  scopes: ['openid', 'profile']
};

export const tokenRequest: msal.SilentRequest = {
  ...loginRequest,
  scopes: [`api://${MSAL_CLIENT_ID}/Default`]
};

export function getMsalApp(): msal.PublicClientApplication {
  if (msalApp) {
    return msalApp;
  } else {
    msalApp = new msal.PublicClientApplication({
      auth: {
        clientId: MSAL_CLIENT_ID,
        authority: MSAL_AUTHORITY,
        redirectUri: `${process.env.REACT_APP_URI}/login`,
        postLogoutRedirectUri: `${process.env.REACT_APP_URI}/logout`,
        navigateToLoginRequestUrl: true
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
        secureCookies: false
      }
    });
    return msalApp;
  }
}
