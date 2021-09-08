import { Name } from '../types';
import { FullAddress } from '../types/FullAddress';

export const formatName = ({ firstName = '', lastName = '', companyName = '' }: Name): string => {
  if (firstName && lastName) {
    return firstName + ' ' + lastName;
  } else if (companyName) {
    return companyName;
  } else {
    return firstName + lastName;
  }
};

export const formatCurrencyAmount = (amount?: number): string =>
  (amount || 0).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const createMapLinkFromAddress = ({ address = '', city = '', state = 'MN', zip = '' }: FullAddress): string =>
  `https://maps.apple.com/?q=${encodeURI(address)}+${encodeURI(city)}+${state}+${zip}`;
