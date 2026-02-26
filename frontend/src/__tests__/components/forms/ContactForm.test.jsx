import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../../components/forms/ContactForm';
import { submissionService } from '../../../services/submissionService';

jest.mock('../../../services/submissionService');

describe('ContactForm', () => {
  beforeEach(() => {
    submissionService.submitContact.mockResolvedValue({ data: { success: true } });
  });

  test('renders all fields and submit button', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Subject/i), 'Test Subject');
    await userEvent.type(screen.getByLabelText(/Message/i), 'Test message');
    await userEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() => {
      expect(submissionService.submitContact).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      });
    });
  });
});
