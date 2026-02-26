import api from '../../../services/api';

describe('api service', () => {
  test('has correct baseURL', () => {
    expect(api.defaults.baseURL).toBe(process.env.REACT_APP_API_URL || 'http://localhost:5001/api');
  });
});
