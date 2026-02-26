import { contentService } from '../../../services/contentService';
import api from '../../../services/api';

jest.mock('../../../services/api');

describe('contentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getServices calls correct endpoint', () => {
    contentService.getServices();
    expect(api.get).toHaveBeenCalledWith('/services');
  });

  test('getServiceById calls with id', () => {
    contentService.getServiceById('ai-consulting');
    expect(api.get).toHaveBeenCalledWith('/services/ai-consulting');
  });

  test('getBlogPosts calls correct endpoint', () => {
    contentService.getBlogPosts();
    expect(api.get).toHaveBeenCalledWith('/blog');
  });

  test('getBlogPostBySlug calls with slug', () => {
    contentService.getBlogPostBySlug('future-of-ai');
    expect(api.get).toHaveBeenCalledWith('/blog/future-of-ai');
  });

  test('getPortfolioProjects calls correct endpoint', () => {
    contentService.getPortfolioProjects();
    expect(api.get).toHaveBeenCalledWith('/portfolio');
  });

  test('getTeamMembers calls correct endpoint', () => {
    contentService.getTeamMembers();
    expect(api.get).toHaveBeenCalledWith('/team');
  });

  test('getFAQs calls correct endpoint', () => {
    contentService.getFAQs();
    expect(api.get).toHaveBeenCalledWith('/faqs');
  });
});
