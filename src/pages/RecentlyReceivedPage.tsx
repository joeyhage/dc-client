import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { JobResult } from '../model';
import { NotificationType, NotificationLevel } from '../types';
import { getRecentlyReceived } from '../util';
import { JobResultsTable, Loading, Notification } from '../components/common';

export const RecentlyReceivedPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  useEffect(() => {
    function executeGetRecentlyReceived() {
      setLoading(true);
      setError({});
      getRecentlyReceived()
        .then(setJobResults)
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error getting recently received jobs. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    executeGetRecentlyReceived();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>Recently Received Jobs | DC Database</title>
      </Helmet>
      <Notification notification={error} />
      <JobResultsTable push={history.push} jobResults={jobResults} />
    </div>
  );
};
