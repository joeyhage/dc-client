import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { JobResult } from '../model';
import { NotificationType, NotificationLevel } from '../types';
import { getActiveContracts } from '../util';
import { JobResultsTable, Loading, Notification } from '../components/common';

export const ActiveContractsPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  useEffect(() => {
    function executeGetActiveContracts() {
      setLoading(true);
      setError({});
      getActiveContracts()
        .then(setJobResults)
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error getting active contracts. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    executeGetActiveContracts();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>Active Contracts | DC Database</title>
      </Helmet>
      <Notification notification={error} />
      <JobResultsTable push={history.push} jobResults={jobResults} />
    </div>
  );
};
