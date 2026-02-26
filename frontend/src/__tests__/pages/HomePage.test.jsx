import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../../../pages/HomePage';

const queryClient = new QueryClient();

describe('HomePage', () => {
  test('renders hero section', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/AI That Works For You/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });
});
