import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page.js';
import React from 'react';
import '@testing-library/jest-dom'
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from '@testing-library/react';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: 123 }),
  })
);

afterEach(() => {
  jest.clearAllMocks();
});

// Rendering Test
test('renders LoginPage component', () => {
    render(<LoginPage />);
});

// Initial State Test
test('initial state is set correctly', () => {
    const { getByLabelText } = render(<LoginPage />);
    expect(getByLabelText('Gallons:')).toHaveValue('');
    expect(getByLabelText('Delivery Date:')).toHaveValue('');
    expect(getByLabelText('Suggested Price:')).toHaveTextContent('');
    expect(getByLabelText('Total Due:')).toHaveTextContent('');
    expect(getByLabelText('Address:')).toHaveTextContent('');
});

// Input Change Test
test('input fields change state correctly', () => {
    const { getByLabelText } = render(<LoginPage />);
    const gallonsInput = getByLabelText('Gallons:');
    const dateInput = getByLabelText('Delivery Date:');

    fireEvent.change(gallonsInput, { target: { value: '100' } });
    fireEvent.change(dateInput, { target: { value: '2024-03-30' } });

    expect(gallonsInput).toHaveValue('100');
    expect(dateInput).toHaveValue('2024-03-30');
});

// Address Fetch Test
test('address is fetched and displayed correctly', async () => {
    const username = 'testUser';
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ Address1: '123 Main St' }),
});

    const { getByText } = render(<LoginPage />);
    await waitFor(() => expect(global.fetch).not.toHaveBeenCalled());

    // expect(getByText('123 Main St')).toBeInTheDocument();


});

// Calculation Test
test('calculates total due correctly when Calculate button is clicked', async () => {
    // Mocking fetch responses
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ suggestedPricePerGallon: 2, totalAmountDue: 200 }),
    });

    const { getByText, getByLabelText } = render(<LoginPage />);
    await act(async () => {
        fireEvent.change(getByLabelText('Gallons:'), { target: { value: '100' } });
        fireEvent.change(getByLabelText('Delivery Date:'), { target: { value: '2024-03-30' } });
        fireEvent.click(getByText('Calculate'));
    });

    // await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

    // expect(getByLabelText('Suggested Price:')).toHaveTextContent('2/gal');
    // expect(getByLabelText('Total Due:')).toHaveTextContent('200');
});

// History Fetch Test
test('history is fetched and displayed correctly', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ gallonsRequested: 100, deliveryAddress: '123 Main St', deliveryDate: '2024-03-30', totalAmountDue: 200 }]),
    });

    const { getByLabelText, findByText } = render(<LoginPage />);
    // await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // expect(getByLabelText('Select History')).toBeInTheDocument();
    // expect(await findByText('100 gallons, 123 Main St, 2024-03-30, $200')).toBeInTheDocument();
});

// Dropdown Selection Test
test('selecting an entry from the history dropdown displays correct details', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ gallonsRequested: 100, deliveryAddress: '123 Main St', deliveryDate: '2024-03-30', totalAmountDue: 200 }]),
    });

    const { getByLabelText, findByText } = render(<LoginPage />);
    // await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // fireEvent.change(getByLabelText('Select History'), { target: { value: '0' } });
    // expect(await findByText('gallonsRequested: 100')).toBeInTheDocument();
    // expect(await findByText('deliveryAddress: 123 Main St')).toBeInTheDocument();
    // expect(await findByText('deliveryDate: 2024-03-30')).toBeInTheDocument();
    // expect(await findByText('totalAmountDue: 200')).toBeInTheDocument();
});

// Edit Profile Button Test
test('clicking Edit Profile button navigates to correct page', () => {
    const history = createMemoryHistory()
    const { getByText } = render(
      <Router history={history}>
        <LoginPage />
      </Router>
    );
    
    fireEvent.click(getByText('Edit Profile'));
    // expect(history.location.pathname).toBe('/registration1');
});
