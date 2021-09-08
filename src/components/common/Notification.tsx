import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { NotificationType, NotificationLevel } from '../../types';

type ThisProps = {
  className?: HTMLElement['className'];
  notification: NotificationType;
};

export const Notification: React.FC<ThisProps> = ({ className, notification }) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (hasNotification(notification)) {
      setVisible(true);
    }
  }, [notification]);

  const notificationClassName = classNames('notification', className, {
    'is-hidden': !isVisible,
    'is-info': NotificationLevel.Info === notification.level,
    'is-warning': NotificationLevel.Warning === notification.level,
    'is-danger': NotificationLevel.Error === notification.level
  });
  return (
    <div className={notificationClassName}>
      <button
        className='delete'
        onClick={() => {
          setVisible(false);
        }}
      />
      {notification.message}
      {!!notification.error && (
        <>
          <br />
          <br />
          <p>
            <strong>Error:</strong> {notification.error.toString()}
          </p>
        </>
      )}
    </div>
  );
};

const hasNotification = ({ level, message }: NotificationType) => typeof level !== 'undefined' && !!message;
