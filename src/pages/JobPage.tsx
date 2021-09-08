import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { Job } from '../model';
import { NotificationType, NotificationLevel } from '../types';
import { retrieveJobByID } from '../util';
import { Loading, Notification, Panel } from '../components/common';
import { InvoiceHistoryTab, JobContactTab, JobInfoTab, PaymentHistoryTab, WorkDescriptionTab } from '../components/job';

type ThisProps = RouteComponentProps & {
  match: {
    params: {
      jobID: string;
    };
  } & RouteComponentProps['match'];
};

export const JobPage: React.FC<ThisProps> = ({ history: { replace }, location, match }) => {
  const [job, setJob] = useState<Job>(new Job({}));
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  useEffect(() => {
    function executeRetrieveJob() {
      setLoading(true);
      setError({});
      retrieveJobByID(Number(match.params.jobID))
        .then((resultJob) => {
          setJob(resultJob);
          replace(location.pathname, {
            customer: resultJob.customer
          });
        })
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error retrieving job information. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    executeRetrieveJob();
  }, [location.pathname, match.params.jobID, replace]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>Job for {job.customer} | DC Database</title>
      </Helmet>
      <Notification notification={error} />
      <section className='section content' id='job-info' style={{ paddingBottom: '1.5rem' }}>
        <div className='columns is-centered'>
          <div className='column is-three-fifths-desktop is-paddingless'>
            <Panel
              heading='Job Customer'
              panelTabNames={['Info', 'Contact']}
              tabContents={[<JobInfoTab {...job} />, <JobContactTab {...job} />]}
            />
          </div>
        </div>
      </section>
      <section className='section content' style={{ padding: '1.5rem', marginBottom: '3rem' }}>
        <div className='columns is-centered'>
          <div className='column is-four-fifths-desktop is-paddingless'>
            <Panel
              heading='Job'
              id='job-panel'
              panelTabNames={['Work Description', 'Payment History', 'Invoice History']}
              tabContents={[
                <WorkDescriptionTab totalAmount={job.totalAmount} workItems={job.workItems} />,
                <PaymentHistoryTab totalPayments={job.totalPayments} payments={job.payments} />,
                <InvoiceHistoryTab invoices={job.invoices} />
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
