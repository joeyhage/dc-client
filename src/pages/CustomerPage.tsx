import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { Customer } from '../model';
import { NotificationType, NotificationLevel } from '../types';
import { retrieveCustomerByID } from '../util';
import { JobResultsTable, Loading, Notification, Panel } from '../components/common';
import { CustomerContactTab, CustomerInfoTab } from '../components/customer';

type ThisProps = RouteComponentProps & {
  match: {
    params: {
      customerID: string;
    };
  } & RouteComponentProps['match'];
};

export const CustomerPage: React.FC<ThisProps> = ({ history, match }) => {
  const [customer, setCustomer] = useState<Customer>(new Customer({}));
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  useEffect(() => {
    function executeRetrieveCustomer() {
      setLoading(true);
      setError({});
      retrieveCustomerByID(Number(match.params.customerID))
        .then(setCustomer)
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error retrieving customer information. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    executeRetrieveCustomer();
  }, [match]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>{customer.name} | DC Database</title>
      </Helmet>
      <Notification notification={error} />
      <section className='section content' id='customer-info'>
        <div className='columns is-centered'>
          <div className='column is-three-fifths-desktop is-paddingless'>
            <Panel
              heading='Customer'
              panelTabNames={['Info', 'Contact']}
              tabContents={[<CustomerInfoTab {...customer} />, <CustomerContactTab {...customer} />]}
              style={{ marginBottom: '3rem' }}
            />
            <Panel
              heading={'Jobs'}
              id='customer-job-panel'
              tabContents={[
                <section className='section panel-table'>
                  <JobResultsTable isSearchResult={false} jobResults={customer.jobs} push={history.push} />
                </section>
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
