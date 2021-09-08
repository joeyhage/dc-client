import * as msal from '@azure/msal-browser';
import { BrowserHistory } from 'history';
import { APP_AUTH_KEY, AppAuth, Profile, PROFILE_KEY } from '../types';
import { getMsalApp, loginRequest, tokenRequest } from './msal-config';

export const LOGIN_IN_PROGRESS_KEY = 'loginInProgress';

export const getProfile = (): Profile => JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') as Profile;

export const getAppAuth = (): AppAuth => JSON.parse(sessionStorage.getItem(APP_AUTH_KEY) || '{}') as AppAuth;

export const isLoggedIn = (): boolean => !!getActiveAccount();

export const getActiveAccount = (): msal.AccountInfo | undefined => getMsalApp().getActiveAccount() || undefined;

const handleResponse = (response: Response): Promise<any> => {
  if (response.status === 200) {
    return response.json();
  } else if (response.status > 200 && response.status < 300) {
    return Promise.resolve();
  } else {
    return Promise.reject(`${response.status} ${response.statusText}`);
  }
};

export const acquireToken = async (): Promise<msal.AuthenticationResult | void> => {
  const msalApp = getMsalApp();
  const account = getActiveAccount();
  try {
    return msalApp.acquireTokenSilent({ ...tokenRequest, account });
  } catch (error) {
    // noinspection JSIgnoredPromiseFromCall
    msalApp.acquireTokenRedirect({ ...tokenRequest, account });
  }
};

export const oAuthFetch = async (
  url: string,
  method: RequestInit['method'] = 'GET',
  body?: RequestInit['body']
): Promise<any> => {
  const tokenResponse = await acquireToken();
  if (!!tokenResponse) {
    const headers: RequestInit['headers'] = { Authorization: `Bearer ${tokenResponse.accessToken}` };
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json';
    }
    return fetch(url, { headers, method, body, credentials: 'include' })
      .then(handleResponse)
      .catch((e) => Promise.reject(!!e ? e : 'Unexpected error. Please try again.'));
  } else {
    return Promise.reject('You are not logged in. Please try again.');
  }
};

export const loginRedirect = (): void => {
  const loginAttemptCount = Number(sessionStorage.getItem('loginAttempt'));
  if (sessionStorage.getItem(LOGIN_IN_PROGRESS_KEY) !== 'true') {
    sessionStorage.setItem(LOGIN_IN_PROGRESS_KEY, 'true');
    // noinspection JSIgnoredPromiseFromCall
    getMsalApp().loginRedirect(loginRequest);
  } else if (loginAttemptCount > 1) {
    sessionStorage.setItem(LOGIN_IN_PROGRESS_KEY, 'false');
  } else {
    sessionStorage.setItem('loginAttempt', String(loginAttemptCount + 1));
  }
};

export const handleRedirect = (onFinally: () => void) => {
  const msalApp = getMsalApp();
  msalApp
    .handleRedirectPromise()
    .then(async (loginResponse) => {
      if (!!loginResponse) {
        msalApp.setActiveAccount(loginResponse.account);
        localStorage.setItem('profile', JSON.stringify({ uniqueId: loginResponse.uniqueId }));
        await establishSession(loginResponse);
      }
    })
    .catch(console.error)
    .finally(() => {
      sessionStorage.setItem(LOGIN_IN_PROGRESS_KEY, 'false');
      onFinally();
    });
};

export const initSession = (accountId: AppAuth['accountId']): Promise<AppAuth> => {
  return new Promise<AppAuth>(async (resolve, reject) => {
    Promise.all([oAuthFetch('/api/init-session'), oAuthFetch(`https://${process.env.REACT_APP_API_DOMAIN}/api/init-session`)])
      .then(([results]: AppAuth[]) => {
        if (!!results.fullName && typeof results.isAdmin === 'boolean' && !!results.employeeId) {
          resolve({
            accountId,
            employeeId: results?.employeeId || '',
            fullName: results?.fullName || '',
            isAdmin: !!results?.isAdmin
          });
        } else {
          alert('Unable to login. Please try again.');
          reject();
        }
      })
      .catch(reject);
  });
};

export const logout = (replace: BrowserHistory['replace']) => {
  localStorage.clear();
  sessionStorage.clear();
  replace('/');
};

const establishSession = async (loginResponse: msal.AuthenticationResult, attempt = 1): Promise<void> => {
  if (!getAppAuth().accountId) {
    try {
      const appAuth = await initSession(loginResponse.uniqueId);
      sessionStorage.setItem(APP_AUTH_KEY, JSON.stringify(appAuth));
    } catch (error) {
      console.error('error initiating session - ' + attempt, error);
      if (++attempt <= 3) {
        await establishSession(loginResponse, attempt);
      } else {
        logout(window.location.replace);
      }
    }
  }
};
