import { BrowserHistory } from 'history';
import React, { useEffect, useState } from 'react';
import { TimecardEntry } from '../../model';
import { AppAuth } from '../../types';
import { buildEditUrl, buildTimecardEntryRow, toDayMonth } from '../../util';

type ThisProps = {
  employeeId: AppAuth['employeeId'];
  isAdmin: AppAuth['isAdmin'];
  selectedDate?: Date;
  timecardEntries: TimecardEntry[];
  push: BrowserHistory['push'];
  isReport?: boolean;
};

export const TimecardEntryRows: React.FC<ThisProps> = ({
  employeeId,
  isAdmin,
  selectedDate,
  timecardEntries,
  push,
  isReport = false
}) => {
  const canModify = !!selectedDate;
  const [totalHours, setTotalHours] = useState<number>(0);

  useEffect(() => {
    setTotalHours(timecardEntries.reduce((prev, current) => prev + current.hours, 0));
  }, [timecardEntries]);

  return (
    <>
      {canModify && (
        <div className='columns is-centered is-mobile mt-6'>
          <div className='column is-narrow'>
            <button
              className='button is-info'
              onClick={() => {
                push(buildEditUrl(isAdmin, employeeId), { employeeId, selectedDate, isNewEntry: true });
              }}
            >
              Add entry ({toDayMonth(selectedDate)})
            </button>
          </div>
        </div>
      )}
      <section id='timecard-section' className='section pt-1'>
        <div style={{ padding: '1.25rem' }}>
          <div className='tile is-ancestor is-hidden-mobile'>
            <div className='tile is-12 is-parent'>
              {isReport && (
                <div className='tile is-child is-2'>
                  <p className='has-text-weight-bold'>Date</p>
                </div>
              )}
              <div className='tile is-child is-4'>
                <p className='has-text-weight-bold'>Location</p>
              </div>
              <div className='tile is-child is-4'>
                <p className='has-text-weight-bold'>Details</p>
              </div>
              <div className='tile is-child is-2'>
                <p className='has-text-weight-bold'>Hours</p>
              </div>
              {!isReport && <div className='tile is-child is-2' />}
            </div>
          </div>
        </div>
        {timecardEntries?.map((timecardEntry, key) =>
          buildTimecardEntryRow(push, canModify, employeeId, isAdmin, isReport, timecardEntry, key)
        ) || <div />}
        {isReport && (
          <div className='tile is-ancestor'>
            <div className='tile is-12 is-parent'>
              <div className='tile is-child is-10' />
              <div className='tile is-child'>
                <p className='has-text-weight-bold'>Total hours: {totalHours}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
