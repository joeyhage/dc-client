import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { JobResult } from '../model';
import { NotificationType, NotificationLevel } from '../types';
import { getRecentEstimates } from '../util';
import { JobResultsTable, Loading, Notification } from '../components/common';

export const RecentEstimatesPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  useEffect(() => {
    function executeGetRecentEstimates() {
      setLoading(true);
      setError({});
      getRecentEstimates()
        .then(setJobResults)
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error getting recent estimates. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    executeGetRecentEstimates();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>Recent Estimates | DC Database</title>
      </Helmet>
      <Notification notification={error} />
      <JobResultsTable push={history.push} jobResults={jobResults} />
    </div>
  );
};
