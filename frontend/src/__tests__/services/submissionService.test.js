import { submissionService } from '../../../services/submissionService';
import api from '../../../services/api';

jest.mock('../../../services/api');

describe('submissionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('submitContact posts to /contact with data', () => {
    const data = { name: 'Test', email: 'test@test.com', subject: 'Hi', message: 'Hello' };
    submissionService.submitContact(data);
    expect(api.post).toHaveBeenCalledWith('/contact', data);
  });

  test('submitApplication posts to /apply with data', () => {
    const data = { company: 'Acme', name: 'John', email: 'j@j.com', service_type: 'AI', requirements: 'Need help' };
    submissionService.submitApplication(data);
    expect(api.post).toHaveBeenCalledWith('/apply', data);
  });
});
