import { render, fireEvent, waitFor, findByText, getByLabelText } from '@testing-library/react';
import MemberProfile from './page.js'; // Assuming the component file is named MemberProfile.js
import React from 'react';
import '@testing-library/jest-dom'

test('renders MemberProfile', () => {
  const { getByText } = render(<MemberProfile />);
  expect(getByText('Member Profile')).toBeInTheDocument();
});

test('changes input values', async () => {
  const { findByLabelText } = render(<MemberProfile />);

  const fullNameInput = await findByLabelText('Full Name:');
  fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

  const address1Input = await findByLabelText('Address 1:');
  fireEvent.change(address1Input, { target: { value: '123 Main St' } });

  const address2Input = await findByLabelText('Address 2:');
  fireEvent.change(address2Input, { target: { value: 'Apt 1' } });
  
  const city = await findByLabelText('City:');
  fireEvent.change(city, { target: { value: 'Springfield' } });

  const zipCode = await findByLabelText('Zip Code:');
  fireEvent.change(zipCode, { target: { value: '12345' } });

  expect(fullNameInput.value).toBe('John Doe');
  expect(address1Input.value).toBe('123 Main St');
  expect(address2Input.value).toBe('Apt 1');
  expect(city.value).toBe('Springfield');
  expect(zipCode.value).toBe('12345');
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: 123 }),
  })
);

afterEach(() => {
  jest.clearAllMocks();
});

test('submits form with valid data', async () => {
  global.fetch = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );

//   const mockSubmitHandler = jest.fn();

  const { getByText, findByLabelText } = render(<MemberProfile />);

  const fullNameInput = await findByLabelText('Full Name:');
  fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

  const address1Input = await findByLabelText('Address 1:');
  fireEvent.change(address1Input, { target: { value: '123 Main St' } });

  const address2Input = await findByLabelText('Address 2:');
  fireEvent.change(address2Input, { target: { value: 'Apt 1' } });
  
  const city = await findByLabelText('City:');
  fireEvent.change(city, { target: { value: 'Springfield' } });

  const zipCode = await findByLabelText('Zip Code:');
  fireEvent.change(zipCode, { target: { value: '12345' } });

  const state = await findByLabelText('State:');
  fireEvent.change(state, { target: { value: 'CA' } }); // Selecting California

  const submitButton = getByText('Save and Continue');
  console.log('Button found, clicking now...');
  fireEvent.click(submitButton);

  // Uncomment and run when server is on, comment otherwise
  // Note: Passes when server is on
  // Check if fetch is called with correct URL and payload
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/subscribers/username/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'John Doe',
        Address1: '123 Main St',
        Address2: 'Apt 1',
        City: 'Springfield',
        State: 'CA',
        Zipcode: '12345'
      })
    });
  });
});

test('validates input fields', async () => {
    const originalAlert = window.alert;
    window.alert = jest.fn();
  
    const { getByText, findByLabelText } = render(<MemberProfile />);
    
    // Submit the form without filling in any fields
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');

    // Fill in the fields with valid data, except name is more than 50 characters
    const fullNameInput = await findByLabelText('Full Name:');
    fireEvent.change(fullNameInput, { target: { value: 'a'.repeat(51) } });

    const address1Input = await findByLabelText('Address 1:');
    fireEvent.change(address1Input, { target: { value: '123 Main St' } });

    const address2Input = await findByLabelText('Address 2:');
    fireEvent.change(address2Input, { target: { value: 'Apt 1' } });
    
    const city = await findByLabelText('City:');
    fireEvent.change(city, { target: { value: 'Springfield' } });

    const zipCode = await findByLabelText('Zip Code:');
    fireEvent.change(zipCode, { target: { value: '12345' } });

    const state = await findByLabelText('State:');
    fireEvent.change(state, { target: { value: 'CA' } }); // Selecting California

    // Submit the form
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('Full Name must be at most 50 characters.');

    // Fill in the fields with valid data, except address 1 is more than 100 characters
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

    fireEvent.change(address1Input, { target: { value: 'a'.repeat(101) } });

    // Submit the form
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('Address 1 must be at most 100 characters.');

    // Fill in the fields with valid data, except address 2 is more than 100 characters
    fireEvent.change(address1Input, { target: { value: '123 Main St' } });

    fireEvent.change(address2Input, { target: { value: 'a'.repeat(101) } });

    // Submit the form
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('Address 2 must be at most 100 characters.');

    // Fill in the fields with valid data, except city is more than 100 characters
    fireEvent.change(address2Input, { target: { value: 'Apt 1' } });

    fireEvent.change(city, { target: { value: 'a'.repeat(101) } });

    // Submit the form
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('City must be at most 100 characters.');

    // Fill in the fields with valid data, except zip code is less than 5 characters
    fireEvent.change(city, { target: { value: 'Springfield' } });

    fireEvent.change(zipCode, { target: { value: '1234' } });

    // Submit the form
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('Zip Code must be between 5 and 9 characters.');

    // Fill in the fields with valid data, except zip code is more than 9 characters
    fireEvent.change(zipCode, { target: { value: '123456789' } });

    // Submit the form
    fireEvent.submit(getByText('Save and Continue'));
    expect(window.alert).toHaveBeenCalledWith('Zip Code must be between 5 and 9 characters.');

    // Restore the original window.alert after the test
    window.alert = originalAlert;
});

test('validates zip code as integers only', async () => {
  const originalAlert = window.alert;
  window.alert = jest.fn();

  const { getByText, findByLabelText } = render(<MemberProfile />);

  const fullNameInput = await findByLabelText('Full Name:');
  fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

  const address1Input = await findByLabelText('Address 1:');
  fireEvent.change(address1Input, { target: { value: '123 Main St' } });

  const address2Input = await findByLabelText('Address 2:');
  fireEvent.change(address2Input, { target: { value: 'Apt 1' } });
  
  const city = await findByLabelText('City:');
  fireEvent.change(city, { target: { value: 'Springfield' } });

  const state = await findByLabelText('State:');
  fireEvent.change(state, { target: { value: 'CA' } });

  // Fill in the zip code field with non-numeric characters
  const zipCodeInput = await findByLabelText('Zip Code:');
  fireEvent.change(zipCodeInput, { target: { value: 'abcde' } });

  // Submit the form
  fireEvent.submit(getByText('Save and Continue'));

  // Expect an alert indicating zip code must contain only digits
  expect(window.alert).toHaveBeenCalledWith('Zip Code must contain only digits.');

  // Restore the original window.alert after the test
  window.alert = originalAlert;
});
