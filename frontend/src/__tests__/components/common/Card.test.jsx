import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Card from '../../../components/common/Card';

describe('Card', () => {
  const props = {
    icon: '🤖',
    title: 'Test Service',
    description: 'This is a test description.',
    linkTo: '/test',
    linkText: 'Learn More'
  };

  test('renders icon, title, description, and link', () => {
    render(
      <BrowserRouter>
        <Card {...props} />
      </BrowserRouter>
    );
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('This is a test description.')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });
});
