import classNames from 'classnames';
import { Location } from 'history';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Customer } from '../../model';
import { getActiveAccount, getAppAuth, isLoggedIn } from '../../util';
import { getMsalApp } from '../../util/msal-config';
import NavItem from './NavItem';

interface Match {
  customerID?: number;
  jobID?: number;
}

export const Header: React.FC<Pick<RouteComponentProps, 'location'>> = ({ location }) => {
  const appAuth = getAppAuth();
  const [isActive, setActive] = useState<boolean>(false);
  const [match, setMatch] = useState<Match>({});

  useEffect(() => {
    window?.scrollTo(0, 0);
    setActive(false);
  }, [location.pathname]);

  useEffect(() => {
    const matches = location.pathname.match(/customer\/(\d+)\/job\/(\d+)/) || [];
    if (!!matches[1] && !!matches[2]) {
      setMatch({ customerID: Number(matches[1]), jobID: Number(matches[2]) });
    }
  }, [location.pathname]);

  const toggleNavbar = () => {
    setActive(!isActive);
  };

  const burgerClass = classNames('navbar-burger', 'burger', { 'is-active': isActive });
  const navigationClass = classNames('navbar-menu', { 'is-active': isActive });
  return (
    <nav className='navbar is-black' id='navigation'>
      <div className='container'>
        <div className='navbar-brand'>
          <Link to='/'>
            <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt='DC Logo' />
          </Link>
          <div className={burgerClass} data-target='navigation' onClick={toggleNavbar}>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={navigationClass}>
          {isLoggedIn() && (
            <>
              <div className='navbar-start'>{appAuth.isAdmin && adminNavigation(location, match)}</div>
              <div className='navbar-end'>
                {!!appAuth.fullName && (
                  <div className='navbar-item is-hidden-touch' id='name'>
                    Hi, {appAuth.fullName.split(' ')[0]}!
                  </div>
                )}
                <Link
                  to='/'
                  className='navbar-item'
                  onClick={() => getMsalApp().logout({ account: getActiveAccount() })}
                >
                  Logout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function adminNavigation(location: Location<{ customer: Customer }>, match: Match): JSX.Element[] {
  const navItems = [
    <NavItem key='search' to='/' location={location}>
      Search
    </NavItem>,
    <NavItem key='recentEstimates' to='/recent-estimates' location={location}>
      Recent Estimates
    </NavItem>,
    <NavItem key='recentlyReceived' to='/recently-received' location={location}>
      Recently Received
    </NavItem>,
    <NavItem key='activeContracts' to='/active-contracts' location={location}>
      Active Contracts
    </NavItem>,
    <NavItem key='employees' to='/employee/list' location={location}>
      Employees
    </NavItem>
  ];
  if (/customer\/\d+\/job\/\d+/.test(location.pathname) && location.state?.customer) {
    navItems.push(
      <NavItem key='customer' to={`/customer/${match.customerID}`} location={location}>
        {location.state.customer}
      </NavItem>
    );
  }
  return navItems;
}
