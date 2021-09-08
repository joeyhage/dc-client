import Icon from '@mdi/react';
import { IconProps } from '@mdi/react/dist/IconProps';
import React from 'react';

export const InlineIcon: React.FC<IconProps> = (props) => {
  return (
    <span className='icon is-inline-block'>
      <Icon {...props} />
    </span>
  );
};
