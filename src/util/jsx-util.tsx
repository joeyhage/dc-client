import { mdiAccountDetails, mdiCheck, mdiTimetable } from '@mdi/js';
import classNames from 'classnames';
import { BrowserHistory } from 'history';
import React, { Fragment } from 'react';
import { InlineIcon } from '../components/common';
import { Employee, JobResult, TimecardEntry } from '../model';
import { toDayMonth } from './date-util';

export const formatPhoneLink = (phoneNumber?: string, phoneExt?: string): JSX.Element =>
  phoneNumber ? (
    <span>
      <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
      {phoneExt ? `+${phoneExt}` : ''}
    </span>
  ) : (
    <p />
  );

export const formatEmailLink = (email?: string): JSX.Element =>
  email ? <a href={`mailto:${email}`}>{email}</a> : <p />;

export const buildJobRow = (
  push: BrowserHistory['push'],
  isSearchResult: boolean,
  showAddress: boolean,
  showAmounts: boolean,
  { customerID, jobID, customer, jobAddress, jobReceiveDate, estimateDate, totalAmount, totalPayments }: JobResult
): JSX.Element => (
  <tr key={jobID}>
    <td className={classNames({ 'is-hidden': !isSearchResult })}>{customer}</td>
    <td className={classNames({ 'is-hidden-touch': !showAddress })}>{jobAddress}</td>
    <td>{estimateDate}</td>
    <td>{jobReceiveDate}</td>
    <td className={classNames({ 'is-hidden-touch': !showAmounts })}>${totalAmount}</td>
    <td className={classNames({ 'is-hidden-touch': !showAmounts })}>${totalPayments}</td>
    <td className='body-icon'>
      <p className='buttons'>
        <button className='button' onClick={() => push(`/customer/${customerID}/job/${jobID}`)}>
          <InlineIcon path={mdiCheck} title='Job Details' />
        </button>
        <button
          className={classNames('button', { 'is-hidden': !isSearchResult })}
          onClick={() => push(`/customer/${customerID}`)}
        >
          <InlineIcon path={mdiAccountDetails} title='Customer Details' />
        </button>
      </p>
    </td>
  </tr>
);

export const buildEmployeeCard = (push: BrowserHistory['push'], { id, firstName, lastName }: Employee): JSX.Element => (
  <div className='column is-one-quarter-desktop is-half-tablet' key={id}>
    <div className='box has-text-white' style={{ backgroundColor: '#874840' }}>
      <h2 className='is-size-4 mb-4' onClick={() => push(`/employee/${id}/timecard`)}>
        {firstName} {lastName}
      </h2>
      <button className='button' onClick={() => push(`/employee/${id}/timecard`)}>
        <InlineIcon path={mdiTimetable} title='View Timecards' />
      </button>
    </div>
  </div>
);

export const buildEditUrl = (isAdmin: boolean, employeeId: string) => {
  return (isAdmin ? `/employee/${employeeId}` : '') + '/timecard/edit';
};

export const buildTimecardEntryRow = (
  push: BrowserHistory['push'],
  canModify: boolean,
  employeeId: string,
  isAdmin: boolean,
  isReport: boolean,
  timecardEntry: TimecardEntry,
  key: number
): JSX.Element => (
  <Fragment key={key}>
    <div className='box' style={{ backgroundColor: '#effaf5' }}>
      <div className='tile is-ancestor is-mobile'>
        <div className='tile is-12 is-parent'>
          {isReport && (
            <div className='tile is-child is-2'>
              <h3 className='is-size-4 is-hidden-tablet'>{toDayMonth(timecardEntry.date)}</h3>
              <p className='is-hidden-mobile has-text-weight-bold'>{toDayMonth(timecardEntry.date)}</p>
            </div>
          )}
          {(!window.matchMedia('(max-width: 768px)').matches || !!timecardEntry.location) && (
            <div className='tile is-child is-4'>
              <p className='has-text-weight-bold is-hidden-tablet'>Location</p>
              <p>{timecardEntry.location}</p>
            </div>
          )}
          {(!window.matchMedia('(max-width: 768px)').matches || !!timecardEntry.description) && (
            <div className='tile is-child is-4'>
              <p className='has-text-weight-bold is-hidden-tablet'>Details</p>
              <p>{timecardEntry.description}</p>
            </div>
          )}
          <div className='tile is-child is-2'>
            <p className='has-text-weight-bold is-hidden-tablet'>Hours</p>
            <p>{timecardEntry.hours} hours</p>
          </div>
          {!isReport && (
            <div className='tile is-child is-2 body-icon'>
              {canModify && (
                <button
                  className='button is-success'
                  onClick={() => push(buildEditUrl(isAdmin, employeeId), { employeeId, timecardEntry })}
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isReport && (
        <div className='tile is-ancestor is-mobile mt-6'>
          <div className='tile is-12 is-parent'>
            <div className='tile is-child'>
              <p className='is-size-7'>
                Created at {timecardEntry?.createdTimestamp} by {timecardEntry?.createdBy}
              </p>
              <p className='is-size-7'>
                Last modified at {timecardEntry?.modifiedTimestamp} by {timecardEntry?.lastModifiedBy}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    <hr className='dark is-hidden-tablet' />
  </Fragment>
);
