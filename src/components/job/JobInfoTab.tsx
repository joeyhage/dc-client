import React from 'react';
import { Job } from '../../model';
import { createMapLinkFromAddress } from '../../util';

export const JobInfoTab: React.FC<Job> = (props) => {
  return (
    <section className='section' style={{ paddingTop: '1.5rem' }}>
      <div className='columns is-centered is-mobile'>
        <table>
          <tbody>
            <tr>
              <td className='has-text-weight-bold'>Customer:</td>
              <td>{props.customer}</td>
            </tr>
            <tr>
              <td className='has-text-weight-bold'>Job Type:</td>
              <td>{props.jobType}</td>
            </tr>
            <tr>
              <td className='has-text-weight-bold'>Estimate Date:</td>
              <td>{props.estimateDate}</td>
            </tr>
            {!!props.receiveDate && (
              <tr>
                <td className='has-text-weight-bold'>Receive Date:</td>
                <td>{props.receiveDate}</td>
              </tr>
            )}
            {!!props.startDate && (
              <tr>
                <td className='has-text-weight-bold'>Start Date:</td>
                <td>{props.startDate}</td>
              </tr>
            )}
            {!!props.completeDate && (
              <tr>
                <td className='has-text-weight-bold'>Complete Date:</td>
                <td>{props.completeDate}</td>
              </tr>
            )}
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
