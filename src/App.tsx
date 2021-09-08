import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Loading } from './components/common';
import { Header } from './components/nav/Header';
import {
  ActiveContractsPage,
  CustomerPage,
  EmployeeHelpPage,
  EmployeePage,
  JobPage,
  RecentEstimatesPage,
  RecentlyReceivedPage,
  SearchPage,
  TimecardEditPage,
  TimecardPage,
  TimecardReportPage
} from './pages';
import { AppAuth } from './types';
import { getAppAuth, isLoggedIn, loginRedirect, logout } from './util';

const App: React.FC = () => {
  const appAuth = getAppAuth();

  return (
    <>
      <Route children={({ location }) => <Header location={location} />} />
      {determineRoutesByAuth(appAuth)}
    </>
  );
};

function adminRoutes(): JSX.Element[] {
  return [
    <Route key='a' exact path='/' component={SearchPage} />,
    <Route key='b' exact path='/recent-estimates' component={RecentEstimatesPage} />,
    <Route key='c' exact path='/recently-received' component={RecentlyReceivedPage} />,
    <Route key='d' exact path='/active-contracts' component={ActiveContractsPage} />,
    <Route key='e' exact path='/customer/:customerID(\d+)' component={CustomerPage} />,
    <Route key='f' exact path='/customer/:customerID(\d+)/job/:jobID(\d+)' component={JobPage} />,
    <Route key='g' exact path='/employee/list' component={EmployeePage} />,
    <Route key='h' exact path='/employee/:employeeID(\w+)/timecard' component={TimecardPage} />,
    <Route key='i' exact path='/employee/:employeeID(\w+)/timecard/edit' component={TimecardEditPage} />,
    <Route key='j' exact path='/employee/:employeeID(\w+)/timecard/reports' component={TimecardReportPage} />
  ];
}

function employeeRoutes(): JSX.Element[] {
  return [
    <Route key='a' exact path='/' component={TimecardPage} />,
    <Route key='b' exact path='/timecard/edit' component={TimecardEditPage} />,
    <Route key='c' exact path='/timecard/reports' component={TimecardReportPage} />,
    <Route key='d' exact path='/help' component={EmployeeHelpPage} />
  ];
}

function determineRoutesByAuth(appAuth: AppAuth): JSX.Element {
  if (isLoggedIn()) {
    return (
      <Switch>
        {appAuth.isAdmin ? adminRoutes() : employeeRoutes()}
        <Route
          exact
          path='/logout'
          render={({ history: { replace } }) => {
            logout(replace);
            return <Loading initialMessage='Logging out, please wait...' />;
          }}
        />
        <Redirect to='/' />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route exact path='/login'>
          <Loading initialMessage='Logging in, please wait...' />
        </Route>
        <Route
          children={() =>
            sessionStorage.getItem('loginInProgress') === 'true' ? (
              <Loading initialMessage='Logging in, please wait...' />
            ) : (
              <div className='section has-text-centered'>
                <button className='button is-link' onClick={loginRedirect}>
                  Please click here to login
                </button>
              </div>
            )
          }
        />
      </Switch>
    );
  }
}

export default App;
