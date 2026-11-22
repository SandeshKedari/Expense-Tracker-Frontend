import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../features/auth/authSlice';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    const store = configureStore({ reducer: { auth: authReducer } });
    render(<Provider store={store}><MemoryRouter><LoginPage /></MemoryRouter></Provider>);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
