import classNames from 'classnames';
import { Location, To } from 'history';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type ThisProps = {
  location: Location;
  to: To;
};

const NavItem: React.FC<ThisProps> = ({ children, location, to }) => {
  const [navItemClasses, setNavItemClasses] = useState<string>('');

  useEffect(() => {
    setNavItemClasses(classNames('navbar-item', { 'is-active': location.pathname === to }));
  }, [location.pathname, to]);

  return (
    <Link to={to} className={navItemClasses}>
      {children}
    </Link>
  );
};

export default NavItem;
