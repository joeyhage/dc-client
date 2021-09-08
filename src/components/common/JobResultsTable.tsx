import {
  mdiAccount,
  mdiCog,
  mdiCreditCardOutline,
  mdiCurrencyUsd,
  mdiFileDocumentEdit,
  mdiHandshake,
  mdiMapMarker
} from '@mdi/js';
import classNames from 'classnames';
import { BrowserHistory } from 'history';
import React, { useEffect, useState } from 'react';
import { JobResult } from '../../model';
import { buildJobRow } from '../../util';
import { InlineIcon } from '.';

type ThisProps = {
  isSearchResult?: boolean;
  jobResults: JobResult[];
  push: BrowserHistory['push'];
};

export const JobResultsTable: React.FC<ThisProps> = ({ isSearchResult = true, jobResults, push }) => {
  const [jobResultRows, setJobResultRows] = useState<JSX.Element[]>([]);
  const [showAddress, setShowAddress] = useState<boolean>(!isSearchResult);
  const [showAmounts, setShowAmounts] = useState<boolean>(false);

  useEffect(() => {
    setJobResultRows(jobResults?.map(buildJobRow.bind(null, push, isSearchResult, showAddress, showAmounts)) || []);
  }, [jobResults, push, isSearchResult, showAddress, showAmounts]);

  return jobResults.length > 0 ? (
    <section className='section content' id='job-results-table'>
      <div className={classNames('field', 'is-grouped', 'is-hidden-desktop')}>
        <p className='control'>
          <button className='button' onClick={() => setShowAddress(!showAddress)}>
            {showAddress ? 'Hide' : 'Show'}&nbsp;Address
          </button>
        </p>
        <p className='control'>
          <button className='button' onClick={() => setShowAmounts(!showAmounts)}>
            {showAmounts ? 'Hide' : 'Show'}&nbsp;Amounts
          </button>
        </p>
      </div>
      <br className={classNames({ 'is-hidden': !isSearchResult })} />
      <br className={classNames({ 'is-hidden': !isSearchResult })} />
      <div className='table-container'>
        <table className='table is-striped is-fullwidth'>
          <thead>
            <tr>
              <th className={classNames({ 'is-hidden': !isSearchResult })}>
                <InlineIcon path={mdiAccount} title='Customer' />
              </th>
              <th className={classNames({ 'is-hidden-touch': !showAddress })}>
                <InlineIcon path={mdiMapMarker} title='Address' />
              </th>
              <th className='date'>
                <InlineIcon path={mdiFileDocumentEdit} title='Estimate Date' />
              </th>
              <th className='date'>
                <InlineIcon path={mdiHandshake} title='Receive Date' />
              </th>
              <th className={classNames({ 'is-hidden-touch': !showAmounts })}>
                <InlineIcon path={mdiCurrencyUsd} title='Job Amount' />
              </th>
              <th className={classNames({ 'is-hidden-touch': !showAmounts })}>
                <InlineIcon path={mdiCreditCardOutline} title='Total Payments' />
              </th>
              <th>
                <InlineIcon path={mdiCog} title='Manage' />
              </th>
            </tr>
          </thead>
          <tbody>{jobResultRows}</tbody>
        </table>
      </div>
    </section>
  ) : (
    <></>
  );
};
