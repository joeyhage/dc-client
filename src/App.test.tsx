import { render } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

jest.mock('./util/auth-util');

test('renders login link', () => {
  // given
  global.scrollTo = jest.fn();

  // when
  const { getByText } = render(
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  );
  const linkElement = getByText(/Please click here to login/i);

  // then
  expect(linkElement).toBeVisible();
});
