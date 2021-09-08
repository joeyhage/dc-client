import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { LoadingSpinner, Notification } from '../components/common';
import { TimecardEntryRows, TimecardReportForm } from '../components/timecard';
import { Employee, TimecardEntry } from '../model';
import { NotificationLevel, NotificationType, TimecardQuery } from '../types';
import { createTimecardReport, getAppAuth } from '../util';

type TimecardReportProps = RouteComponentProps & {
  location: {
    state: {
      employee: Employee;
    };
  };
};

export const TimecardReportPage: React.FC<TimecardReportProps> = ({ location, history: { push, replace } }) => {
  const appAuth = getAppAuth();
  const { employee } = location.state;

  useEffect(() => {
    if (!employee) {
      replace(appAuth.isAdmin ? '/employee/list' : '/');
    }
  }, [appAuth.isAdmin, employee, replace]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  const [timecardEntries, setTimecardEntries] = useState<TimecardEntry[]>([]);

  const handleError = (error: NotificationType['error']) => {
    setError({
      level: NotificationLevel.Warning,
      message: <p>Error retrieving timecard entries. Please try again.</p>,
      error
    });
  };

  const createReport = ({ startDate, endDate }: TimecardQuery) => {
    setLoading(true);
    setError({});
    createTimecardReport(employee.id, new Date(startDate), new Date(endDate))
      .then((timecardEntries: TimecardEntry[]) => {
        setTimecardEntries(timecardEntries.sort((a, b) => a.date.getTime() - b.date.getTime()));
        if (!timecardEntries || timecardEntries.length === 0) {
          setError({ level: NotificationLevel.Info, message: 'No results' });
        }
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  return (
    <div className='container is-fluid'>
      <Helmet>
        <title>Timecard Report | DC Database</title>
      </Helmet>
      <br />
      <br />
      <div className='columns is-centered mb-5'>
        <div className='column is-two-fifths-desktop is-three-fifths-tablet'>
          <h1 className='is-size-3 mb-6'>
            {employee.firstName || ''} {employee.lastName || ''}
          </h1>
          <TimecardReportForm
            createReport={createReport}
            employeeId={employee.id}
            isAdmin={appAuth.isAdmin}
            push={push}
          />
        </div>
      </div>
      <Notification notification={error} />
      {isLoading ? (
        <div className='loading-spinner' style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <TimecardEntryRows
          employeeId={employee.id}
          isAdmin={appAuth.isAdmin}
          timecardEntries={timecardEntries}
          push={push}
          isReport={true}
        />
      )}
    </div>
  );
};
