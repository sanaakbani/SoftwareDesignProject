import { render, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from './page.js'; // Assuming the component file is named SignUpPage.js
import React from 'react';
import '@testing-library/jest-dom'

beforeEach(() => {
    window.confirm = jest.fn(() => true); // This will make window.confirm always return true
});
  
afterEach(() => {
    window.confirm.mockClear(); // This will clear the mock after each test
});

test('renders SignUpPage', () => {
  const { getByText } = render(<SignUpPage />);
  expect(getByText('Sign Up Page')).toBeInTheDocument();
});

test('changes username, password, and confirm password inputs', () => {
  const { getByPlaceholderText } = render(<SignUpPage />);
  fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testUser' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPass' } });
  fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPass' } });
  expect(getByPlaceholderText('Username').value).toBe('testUser');
  expect(getByPlaceholderText('Password').value).toBe('testPass');
  expect(getByPlaceholderText('Confirm Password').value).toBe('testPass');
});

test('handles sign up with correct and incorrect credentials', async () => {
  global.fetch = jest.fn().mockImplementation((url, options) => {
    const { Username, Password } = JSON.parse(options.body);
    if (Username === 'existingUser') {
      return Promise.resolve({ status: 400, json: () => Promise.resolve({ message: 'Username already exists' }) });
    } else if (Username === 'newUser' && Password === 'testPass') {
      return Promise.resolve({ status: 201 });
    }
    return Promise.reject(new Error('Unexpected request'));
  });

  const { getByText, getByPlaceholderText, getByRole } = render(<SignUpPage />);

  // Testing with existing username
  fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'existingUser' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPass' } });
  fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPass' } });
  fireEvent.click(getByRole('button', { name: /sign up/i }));

  await waitFor(() => expect(getByText('Username already exists')).toBeInTheDocument());

  // Testing with new username and matching passwords
  fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'newUser' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testPass' } });
  fireEvent.change(getByPlaceholderText('Confirm Password'), { target: { value: 'testPass' } });
  fireEvent.click(getByRole('button', { name: /sign up/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
});