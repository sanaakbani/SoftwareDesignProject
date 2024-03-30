import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page.js';
import React from 'react';
import '@testing-library/jest-dom'

let originalWindowLocation;

beforeEach(() => {
  originalWindowLocation = window.location;
  delete window.location;
  window.location = { href: jest.fn() };
});

afterEach(() => {
  window.location = originalWindowLocation;
});

test('renders LoginPage', () => {
  const { getByText } = render(<LoginPage />);
  expect(getByText('Login Page')).toBeInTheDocument();
});

test('changes username and password inputs', () => {
  const { getByPlaceholderText } = render(<LoginPage />);
  fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testUser' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPass' } });
  expect(getByPlaceholderText('Username').value).toBe('testUser');
  expect(getByPlaceholderText('Password').value).toBe('testPass');
  window.location.href = jest.fn(() => 'http://example.com');
});

test('handles login with correct and incorrect credentials', async () => {
  global.fetch = jest.fn().mockImplementation((url, options) => {
    const { Username, Password } = JSON.parse(options.body);
    if (Username === 'testUser' && Password === 'testPass') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Incorrect username or password. If not registered Click Sign in Button' })
    });
  });

  const { getByText, getByPlaceholderText, getByRole } = render(<LoginPage />);
  fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'wrongUser' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongPass' } });
  fireEvent.click(getByRole('button', { name: /login/i }));

  await waitFor(() => expect(getByText('Incorrect username or password. If not registered Click Sign in Button')).toBeInTheDocument());

  fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testUser' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPass' } });
  fireEvent.click(getByRole('button', { name: /login/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
});
