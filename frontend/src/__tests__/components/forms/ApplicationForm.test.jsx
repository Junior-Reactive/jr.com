import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ApplicationForm from '../../../components/forms/ApplicationForm';
import { submissionService } from '../../../services/submissionService';

jest.mock('../../../services/submissionService');

describe('ApplicationForm', () => {
  beforeEach(() => {
    submissionService.submitApplication.mockResolvedValue({ data: { success: true } });
  });

  test('renders required fields', () => {
    render(
      <BrowserRouter>
        <ApplicationForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Contact Person Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Interested In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Requirements/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Application/i })).toBeInTheDocument();
  });

  test('submits form with data', async () => {
    render(
      <BrowserRouter>
        <ApplicationForm />
      </BrowserRouter>
    );
    await userEvent.type(screen.getByLabelText(/Contact Person Name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/Company Name/i), 'Acme Inc');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '123456789');
    await userEvent.selectOptions(screen.getByLabelText(/Service Interested In/i), 'AI Consulting');
    await userEvent.type(screen.getByLabelText(/Project Requirements/i), 'Need AI solution.');
    await userEvent.click(screen.getByRole('button', { name: /Submit Application/i }));

    await waitFor(() => {
      expect(submissionService.submitApplication).toHaveBeenCalledWith({
        company: 'Acme Inc',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123456789',
        service_type: 'AI Consulting',
        requirements: 'Need AI solution.'
      });
    });
  });
});
