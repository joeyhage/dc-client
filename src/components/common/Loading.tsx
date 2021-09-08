import React, { useEffect, useState } from 'react';

type LoadingSpinnerProps = {
  initialMessage?: string;
  promptReload?: boolean;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ initialMessage = '', promptReload = true }) => {
  const [loadingMessage, setLoadingMessage] = useState<string>(initialMessage);
  useEffect(() => {
    if (promptReload) {
      const timeout = setTimeout(() => {
        setLoadingMessage('This is taking longer than expected... Please reload the page to try again.');
      }, 15000);
      return clearTimeout.bind(null, timeout);
    }
  }, [promptReload]);
  return (
    <>
      <img className='loading-spinner-svg' src={'/loading.svg'} alt='loading' />
      <p className='has-text-centered mx-4'>{loadingMessage}</p>
    </>
  );
};

export const Loading: React.FC<LoadingSpinnerProps> = (props) => {
  return (
    <div className='loading-spinner'>
      <LoadingSpinner {...props} />
    </div>
  );
};
