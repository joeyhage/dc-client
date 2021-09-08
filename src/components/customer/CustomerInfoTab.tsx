import React from 'react';
import { Customer } from '../../model';
import { createMapLinkFromAddress } from '../../util';

export const CustomerInfoTab: React.FC<Customer> = (props) => {
  return (
    <section className='section' style={{ paddingTop: '1.5rem' }}>
      <div className='columns is-centered is-mobile'>
        <table>
          <tbody>
            <tr>
              <td className='has-text-weight-bold'>Customer:</td>
              <td>{props.name}</td>
            </tr>
            {!!props.customer2Name && (
              <tr>
                <td className='has-text-weight-bold'>Customer 2:</td>
                <td>{props.customer2Name}</td>
              </tr>
            )}
            <tr>
              <td className='has-text-weight-bold'>Billing Contact:</td>
              <td>{props.billingContact}</td>
            </tr>
            <tr>
              <td className='has-text-weight-bold'>Address:</td>
              <td>
                <a href={createMapLinkFromAddress(props)} target='_blank' rel='noopener noreferrer'>
                  <p className='is-marginless'>{props.address}</p>
                  <p className='is-marginless'>
                    {props.city}, {props.state} {props.zip}
                  </p>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
