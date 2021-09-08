import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { Loading, Notification } from '../components/common';
import { Employee } from '../model';
import { NotificationLevel, NotificationType } from '../types';
import { buildEmployeeCard, retrieveEmployeeList } from '../util';

export const EmployeePage: React.FC<RouteComponentProps> = ({ history: { push } }) => {
  const [employeeTiles, setEmployeeTiles] = useState<JSX.Element[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  useEffect(() => {
    function executeRetrieveEmployeeList() {
      setLoading(true);
      setError({});
      retrieveEmployeeList()
        .then((employees: Employee[]) => {
          setEmployeeTiles(
            employees
              ?.sort((a, b) => {
                if (a.lastName < b.lastName) {
                  return -1;
                } else if (a.lastName === b.lastName) {
                  return a.firstName < b.firstName ? -1 : 1;
                }
                return 1;
              })
              ?.map(buildEmployeeCard.bind(null, push)) || []
          );
        })
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error retrieving employee list. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    executeRetrieveEmployeeList();
  }, [push]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>Employees | DC Database</title>
      </Helmet>
      <Notification notification={error} />
      <div className='section'>
        <div className='columns is-multiline'>{employeeTiles}</div>
      </div>
    </div>
  );
};
