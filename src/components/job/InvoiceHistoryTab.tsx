import { mdiCalendar, mdiCurrencyUsd } from '@mdi/js';
import React, { useEffect, useState } from 'react';
import { Invoice } from '../../model';
import { InlineIcon } from '../common';

type ThisProps = {
  invoices: Invoice[];
};

export const InvoiceHistoryTab: React.FC<ThisProps> = ({ invoices }) => {
  const [invoiceRows, setInvoiceRows] = useState<JSX.Element[]>();

  useEffect(() => {
    setInvoiceRows(invoices?.map(buildInvoiceRow) || []);
  }, [invoices]);

  return (
    <section className='section panel-table'>
      <div className='columns is-centered is-mobile'>
        <div className='column is-three-fifths-desktop'>
          <table>
            <thead>
              <tr>
                <th className='date'>
                  <InlineIcon path={mdiCalendar} title='Invoice Date' />
                </th>
                <th>
                  <InlineIcon path={mdiCurrencyUsd} title='Invoice Amount' />
                </th>
              </tr>
            </thead>
            <tbody>{invoiceRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const buildInvoiceRow = ({ invoiceAmount, invoiceDate }: Invoice, key: number): JSX.Element => (
  <tr key={key}>
    <td>{invoiceDate}</td>
    <td>{invoiceAmount}</td>
  </tr>
);
