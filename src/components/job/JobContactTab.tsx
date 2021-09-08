import React from 'react';
import { Job } from '../../model';
import { formatPhoneLink } from '../../util';

export const JobContactTab: React.FC<Job> = (props) => {
  return (
    <section className='section' style={{ paddingTop: '1.5rem' }}>
      <div className='columns is-centered is-mobile'>
        <table>
          <tbody>
            {!!props.contact && (
              <tr>
                <td className='has-text-weight-bold'>Job Contact:</td>
                <td>{props.contact}</td>
              </tr>
            )}
            {!!props.secondContact && (
              <tr>
                <td className='has-text-weight-bold'>Job Contact 2:</td>
                <td>{props.secondContact}</td>
              </tr>
            )}
            <tr>
              <td className='has-text-weight-bold'>{props.phone1Type}:</td>
              <td>{formatPhoneLink(props.phone1)}</td>
            </tr>
            {!!props.phone2 && (
              <tr>
                <td className='has-text-weight-bold'>{props.phone2Type}:</td>
                <td>{formatPhoneLink(props.phone2)}</td>
              </tr>
            )}
            {!!props.phone3 && (
              <tr>
                <td className='has-text-weight-bold'>{props.phone3Type}:</td>
                <td>{formatPhoneLink(props.phone3)}</td>
              </tr>
            )}
            {!!props.phone4 && (
              <tr>
                <td className='has-text-weight-bold'>{props.phone4Type}:</td>
                <td>{formatPhoneLink(props.phone4)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
