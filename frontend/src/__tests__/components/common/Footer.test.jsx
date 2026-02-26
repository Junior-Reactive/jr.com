import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../../components/common/Footer';

describe('Footer', () => {
  test('renders company info and links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(/Junior Reactive/i)).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Apply for Services')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText(/\+256 764524816/i)).toBeInTheDocument();
    expect(screen.getByText(/juniorreactive@gmail.com/i)).toBeInTheDocument();
  });
});
