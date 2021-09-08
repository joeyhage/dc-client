import React from 'react';
import { Customer } from '../../model';
import { formatEmailLink, formatPhoneLink } from '../../util';

export const CustomerContactTab: React.FC<Customer> = (props) => {
  return (
    <section className='section' style={{ paddingTop: '1.5rem' }}>
      <div className='columns is-centered is-mobile'>
        <table>
          <tbody>
            <tr>
              <td className='has-text-weight-bold'>{props.phone1Type}:</td>
              <td>{formatPhoneLink(props.phone1, props.phoneExt1)}</td>
            </tr>
            {!!props.phone2 && (
              <tr>
                <td className='has-text-weight-bold'>{props.phone2Type}:</td>
                <td>{formatPhoneLink(props.phone2, props.phoneExt2)}</td>
              </tr>
            )}
            {!!props.phone3 && (
              <tr>
                <td className='has-text-weight-bold'>{props.phone3Type}:</td>
                <td>{formatPhoneLink(props.phone3, props.phoneExt3)}</td>
              </tr>
            )}
            {!!props.phone4 && (
              <tr>
                <td className='has-text-weight-bold'>{props.phone4Type}:</td>
                <td>{formatPhoneLink(props.phone4, props.phoneExt4)}</td>
              </tr>
            )}
            <tr>
              <td className='has-text-weight-bold'>Email:</td>
              <td>{formatEmailLink(props.emailOne)}</td>
            </tr>
            {!!props.emailTwo && (
              <tr>
                <td className='has-text-weight-bold'>Email 2:</td>
                <td>{formatEmailLink(props.emailTwo)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
