import classNames from 'classnames';
import React, { FormEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { Loading, Notification } from '../components/common';
import { TimecardEntry } from '../model';
import { Field, NotificationLevel, NotificationType } from '../types';
import { deleteTimecardEntry, getAppAuth, saveTimecardEntry, toMediumDate } from '../util';

type ThisProps = RouteComponentProps & {
  location: {
    state?: {
      employeeId?: string;
      timecardEntry?: TimecardEntry;
      isNewEntry?: boolean;
      selectedDate?: TimecardEntry['date'];
    };
  };
};

const hasInvalidCharacters = (value: string) => !/^[\w\s.,]+$/.test(value);

export const TimecardEditPage: React.FC<ThisProps> = ({ location: { state }, history: { push, replace } }) => {
  const appAuth = getAppAuth();
  const { selectedDate, employeeId, isNewEntry, timecardEntry } = state || {};

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const closeModal = setModalVisible.bind(null, false);

  const goToEmployeeTimecardPage = push.bind(null, appAuth.isAdmin ? `/employee/${employeeId}/timecard` : '/', {
    selectedDate: isNewEntry ? selectedDate : timecardEntry.date
  });

  const deleteTimecard = () => {
    setLoading(true);
    setError({});
    closeModal();
    deleteTimecardEntry(employeeId, timecardEntry.id)
      .then(goToEmployeeTimecardPage)
      .catch((error) => {
        setLoading(false);
        setError({
          level: NotificationLevel.Warning,
          message: <p>Error deleting timecard entry. Please try again.</p>,
          error
        });
      });
  };

  useEffect(() => {
    if (!employeeId || (isNewEntry && !selectedDate) || (!isNewEntry && !timecardEntry)) {
      replace(appAuth.isAdmin ? '/employee/list' : '/', {
        selectedDate: isNewEntry ? selectedDate : timecardEntry.date
      });
    }
  }, [appAuth.isAdmin, employeeId, isNewEntry, selectedDate, timecardEntry, replace]);

  const [hours, setHours] = useState<Field>({ value: isNewEntry ? '0' : timecardEntry.hours, error: '' });
  const [location, setLocation] = useState<Field>({ value: isNewEntry ? '' : timecardEntry.location, error: '' });
  const [description, setDescription] = useState<Field>({
    value: isNewEntry ? '' : timecardEntry.description,
    error: ''
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;
    if (!hours.value) {
      setHours({ ...hours, error: 'Number of hours worked is required.' });
      hasError = true;
    } else if (!Number(hours.value) || Number(hours.value) <= 0 || Number(hours.value) >= 24) {
      setHours({ ...hours, error: 'Number of hours worked must be greater than 0 and less than 24.' });
      hasError = true;
    }

    if (!!location.value && hasInvalidCharacters(location.value)) {
      setLocation({
        ...location,
        error: 'Only letters, numbers, spaces, periods, and commas are allowed.'
      });
      hasError = true;
    }
    if (!!description.value && hasInvalidCharacters(description.value)) {
      setDescription({
        ...description,
        error: 'Only letters, numbers, spaces, periods, and commas are allowed.'
      });
      hasError = true;
    }
    if (!hasError) {
      const submittedEntry = {
        id: isNewEntry ? null : timecardEntry?.id,
        date: isNewEntry ? selectedDate.getTime() / 1000 : null,
        hours: Number(hours.value),
        location: location.value,
        description: description.value
      };
      if (
        isNewEntry ||
        submittedEntry.hours !== timecardEntry.hours ||
        submittedEntry.location !== timecardEntry.location ||
        submittedEntry.description !== timecardEntry.description
      ) {
        setLoading(true);
        setError({});
        saveTimecardEntry(employeeId, submittedEntry)
          .then(goToEmployeeTimecardPage)
          .catch((error) => {
            setLoading(false);
            setError({
              level: NotificationLevel.Warning,
              message: <p>Error {isNewEntry ? 'adding new' : 'updating'} timecard entry. Please try again.</p>,
              error
            });
          });
      } else {
        goToEmployeeTimecardPage();
      }
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid' style={{ paddingTop: '1.5rem' }}>
      <Helmet>
        <title>Edit Timecard | DC Database</title>
      </Helmet>
      <div className='columns is-multiline is-centered is-mobile'>
        <div className='column is-full'>
          <Notification notification={error} />
        </div>
        <div className='column is-half-desktop is-three-quarters-tablet'>
          <form onSubmit={onSubmit}>
            <h1 className='is-size-5 mb-4'>
              {toMediumDate((isNewEntry ? selectedDate : timecardEntry.date)?.toLocaleDateString())}
            </h1>
            <div className='field mb-5'>
              <label htmlFor='hours' className='label'>
                Number of hours worked (required)
              </label>
              <div className='control'>
                <input
                  id='hours'
                  className={classNames('input', { 'is-danger': !!hours.error })}
                  type='text'
                  value={hours.value}
                  onChange={(e) => {
                    setHours({ ...hours, value: e.target.value });
                  }}
                  onBlur={() => setHours({ ...hours, error: '' })}
                />
              </div>
              {!!hours.error && <p className='help is-danger'>{hours.error}</p>}
            </div>
            <div className='field mb-5'>
              <label htmlFor='street-address' className='label'>
                Street address
              </label>
              <div className='control'>
                <input
                  id='street-address'
                  className={classNames('input', { 'is-danger': !!location.error })}
                  type='text'
                  value={location.value}
                  onChange={(e) => {
                    setLocation({ ...location, value: e.target.value });
                  }}
                  onBlur={() => {
                    setLocation({ ...location, error: '' });
                  }}
                />
              </div>
              {!!location.error && <p className='help is-danger'>{location.error}</p>}
            </div>
            <div className='field mb-5'>
              <label htmlFor='description' className='label'>
                Description of work
              </label>
              <div className='control'>
                <textarea
                  id='description'
                  className={classNames('textarea', { 'is-danger': !!description.error })}
                  rows={3}
                  value={description.value}
                  onChange={(e) => {
                    setDescription({ ...description, value: e.target.value });
                  }}
                  onBlur={() => {
                    setDescription({ ...description, error: '' });
                  }}
                />
              </div>
              {!!description.error && <p className='help is-danger'>{description.error}</p>}
            </div>
            <div className='columns is-mobile'>
              <div className='column is-6'>
                <div className='field is-grouped'>
                  <div className='control'>
                    <button type='submit' className='button is-link'>
                      {isNewEntry ? 'Add' : 'Save'}
                    </button>
                  </div>
                  <div className='control'>
                    <button
                      className='button is-link is-light'
                      onClick={(e) => {
                        e.preventDefault();
                        goToEmployeeTimecardPage();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              {!isNewEntry && (
                <div className='column is-6 is-pulled-right'>
                  <button
                    type='button'
                    className='button is-theme is-light is-pulled-right'
                    onClick={setModalVisible.bind(null, true)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            {!isNewEntry && (
              <div className='my-6'>
                <p className='is-size-7'>
                  Created at {timecardEntry?.createdTimestamp} by {timecardEntry?.createdBy}
                </p>
                <p className='is-size-7'>
                  Last modified at {timecardEntry?.modifiedTimestamp} by {timecardEntry?.lastModifiedBy}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className={classNames('modal', { 'is-active': isModalVisible })}>
        <div className='modal-background' onClick={closeModal} />
        <div className='modal-content'>
          <div className='box'>
            <p className='mb-3'>Are you sure you want to delete this timecard entry? This action cannot be undone.</p>
            <div className='field is-grouped'>
              <div className='control'>
                <button className='button is-theme is-light' onClick={deleteTimecard}>
                  Yes
                </button>
              </div>
              <div className='control'>
                <button className='button is-link is-light' onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className='modal-close is-large' aria-label='close' onClick={closeModal} />
      </div>
    </div>
  );
};
