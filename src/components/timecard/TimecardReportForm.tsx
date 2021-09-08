import { BrowserHistory } from 'history';
import React, { FormEvent, useState } from 'react';
import { AppAuth, TimecardQuery } from '../../types';
import { determinePayPeriods } from '../../util';

type ThisProps = {
  createReport: (timecardQuery: TimecardQuery) => void;
  employeeId: AppAuth['employeeId'];
  isAdmin: AppAuth['isAdmin'];
  push: BrowserHistory['push'];
};

export const TimecardReportForm: React.FC<ThisProps> = ({ createReport, employeeId, isAdmin, push }) => {
  const [payPeriods] = useState<string[]>(determinePayPeriods);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(payPeriods[0]);

  const goToEmployeeTimecardPage = push.bind(null, isAdmin ? `/employee/${employeeId}/timecard` : '/');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [startDate, endDate] = selectedPeriod.split(' - ');
    createReport({ startDate, endDate });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='field'>
        <label htmlFor='pay-period' className='label'>
          Pay Period
        </label>
        <p className='control'>
          <span className='select'>
            <select
              id='pay-period'
              value={selectedPeriod}
              onChange={({ target }) => {
                setSelectedPeriod(target.value);
              }}
            >
              {payPeriods.map((value, index) => (
                <option value={value} key={index}>
                  {value}
                </option>
              ))}
            </select>
          </span>
        </p>
      </div>
      <div className='field is-grouped'>
        <div className='control'>
          <button type='submit' className='button is-link'>
            Create report
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
            Go back
          </button>
        </div>
      </div>
    </form>
  );
};
