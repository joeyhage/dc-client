import { getDayStart, getMonthHuman, getMonthStart, getYearStart } from '@wojtekmaj/date-utils';
import React, { useEffect, useState } from 'react';
import Calendar, { CalendarTileProperties } from 'react-calendar';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { Loading, LoadingSpinner, Notification } from '../components/common';
import { onPageLoadPromises, onStartDateChangePromises, TimecardEntryRows } from '../components/timecard';
import { DailyHours, Employee, TimecardEntry } from '../model';
import { NotificationLevel, NotificationType } from '../types';
import { getAppAuth, getTimecardEntries, toDayOfMonth, toMediumDate } from '../util';

export type TimecardProps = RouteComponentProps & {
  location: {
    state?: {
      selectedDate?: TimecardEntry['date'];
    };
  };
  match?: {
    params: {
      employeeID: string;
    };
  } & RouteComponentProps['match'];
};

const currentDate = getDayStart(new Date());

const getTileClassName = ({ date }: CalendarTileProperties): string =>
  getDayStart(date).getTime() === currentDate.getTime() ? 'today' : '';

const determineHoursWorkedOnDate = (
  selectedDate: Date,
  dailyHours?: DailyHours[]
): (({ date }: CalendarTileProperties) => JSX.Element) => ({ date }) => {
  const hoursForDate = selectedDate.getMonth() === date.getMonth() ? getHoursForDate(date, dailyHours) : undefined;
  return <p>{!!hoursForDate ? hoursForDate : ''}</p>;
};

const getHoursForDate = (date: Date, dailyHours?: DailyHours[]) =>
  dailyHours?.find((hours) => hours.dayOfMonth === toDayOfMonth(date.toLocaleString()))?.totalHours || undefined;

export const TimecardPage: React.FC<TimecardProps> = ({ location, match, history: { push } }) => {
  const appAuth = getAppAuth();

  const [isPageLoading, setPageLoading] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  const [initialDate] = useState<Date>(location?.state?.selectedDate || currentDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [employee, setEmployee] = useState<Employee>();
  const [dailyHours, setDailyHours] = useState<DailyHours[]>();
  const [timecardEntries, setTimecardEntries] = useState<TimecardEntry[]>([]);

  const handleError = (date?: Date) => (error: NotificationType['error']) => {
    setError({
      level: NotificationLevel.Warning,
      message: (
        <p>
          Error loading timecard {date ? 'for ' + toMediumDate(date.toLocaleDateString()) : 'page'}. Please try again.
        </p>
      ),
      error
    });
  };

  useEffect(() => {
    setPageLoading(true);
    setError({});
    Promise.all(onPageLoadPromises(initialDate, match))
      .then(([employeeResult, dailyHoursResult, timecardEntriesResult]) => {
        setEmployee(employeeResult);
        setDailyHours(dailyHoursResult);
        setTimecardEntries(timecardEntriesResult);
      })
      .catch(handleError())
      .finally(() => {
        setPageLoading(false);
      });
  }, [match, initialDate]);

  return isPageLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>
          {!!employee?.firstName ? `${employee?.firstName}'s ` : ''}Timecard | DC Database
        </title>
      </Helmet>
      <br />
      <br />
      <div className='columns is-centered is-mobile mb-5'>
        <div className='column is-two-fifths-desktop is-three-fifths-tablet is-12-mobile'>
          <h1 className='is-size-3'>
            {employee?.firstName || ''} {employee?.lastName || ''}
            <button
              className='button is-info is-light is-pulled-right is-hidden-mobile'
              onClick={() =>
                push(appAuth.isAdmin ? `/employee/${employee?.id}/timecard/reports` : '/timecard/reports', { employee })
              }
            >
              Create report
            </button>
          </h1>
          <button
            className='button is-info is-light is-hidden-tablet mt-4 mb-2'
            onClick={() =>
              push(appAuth.isAdmin ? `/employee/${employee?.id}/timecard/reports` : '/timecard/reports', { employee })
            }
          >
            Create report
          </button>
        </div>
      </div>
      <Calendar
        locale='en-US'
        maxDate={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)}
        minDate={getYearStart(currentDate)}
        minDetail='month'
        onActiveStartDateChange={({ activeStartDate, value }) => {
          const newMonth = getMonthStart(activeStartDate);
          const newDate = value.getMonth() !== newMonth.getMonth() ? newMonth : value;
          setSelectedDate(newDate);
          if (employee?.id) {
            setError({});
            setLoading(true);
            Promise.all(onStartDateChangePromises(employee, newDate, value))
              .then(([dailyHours, timecardEntries]) => {
                setDailyHours(dailyHours);
                if (typeof timecardEntries !== 'undefined') {
                  setTimecardEntries(timecardEntries);
                }
              })
              .catch(handleError(newDate))
              .finally(() => {
                setLoading(false);
              });
          }
        }}
        onClickDay={(date) => {
          setSelectedDate(getDayStart(date));
          if (employee?.id) {
            setError({});
            setLoading(true);
            getTimecardEntries(employee.id, date.getFullYear(), getMonthHuman(date), date.getDate())
              .then(setTimecardEntries)
              .catch(handleError(date))
              .finally(() => {
                setLoading(false);
              });
          }
        }}
        tileClassName={getTileClassName}
        tileContent={determineHoursWorkedOnDate(selectedDate, dailyHours)}
        value={selectedDate}
      />
      {isLoading ? (
        <div className='loading-spinner' style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Notification notification={error} />
          {!!employee && (
            <>
              <TimecardEntryRows
                employeeId={employee.id}
                isAdmin={appAuth.isAdmin}
                selectedDate={selectedDate}
                timecardEntries={timecardEntries}
                push={push}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
