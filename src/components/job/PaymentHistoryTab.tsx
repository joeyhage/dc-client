import { mdiBankTransfer, mdiCalendar, mdiCurrencyUsd } from '@mdi/js';
import React, { useEffect, useState } from 'react';
import { Payment } from '../../model';
import { InlineIcon } from '../common';

type ThisProps = {
  totalPayments: string;
  payments: Payment[];
};

export const PaymentHistoryTab: React.FC<ThisProps> = ({ payments, totalPayments }) => {
  const [paymentRows, setPaymentRows] = useState<JSX.Element[]>();

  useEffect(() => {
    setPaymentRows(payments?.map(buildPaymentRow) || []);
  }, [payments]);

  return (
    <section className='section panel-table'>
      <div className='columns is-centered is-mobile'>
        <div className='column is-three-fifths-desktop'>
          <table>
            <thead>
              <tr>
                <th className='date'>
                  <InlineIcon path={mdiCalendar} title='Payment Date' />
                </th>
                <th>
                  <InlineIcon path={mdiBankTransfer} title='Payment Method' />
                </th>
                <th>
                  <InlineIcon path={mdiCurrencyUsd} title='Payment Amount' />
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentRows}
              <tr>
                <td />
                <td>
                  <p className='has-text-weight-bold'>Total</p>
                </td>
                <td>
                  <p className='has-text-weight-bold'>{totalPayments}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const buildPaymentRow = ({ paymentDate, paymentMethod, paymentAmount }: Payment, key: number): JSX.Element => (
  <tr key={key}>
    <td>{paymentDate}</td>
    <td>{paymentMethod}</td>
    <td>{paymentAmount}</td>
  </tr>
);
