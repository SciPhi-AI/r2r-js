import { r2rClient } from '../src/r2rClient';
import axios from 'axios';

jest.mock('axios');

describe('R2RClient', () => {
  let client: r2rClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      defaults: { baseURL: 'http://0.0.0.0:8000/v1' }
    };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    client = new r2rClient('http://0.0.0.0:8000');
  });

  describe('Mocked Tests', () => {
    test('should correctly set the baseURL with prefix', () => {
      expect((client as any).axiosInstance.defaults.baseURL).toBe('http://0.0.0.0:8000/v1');
    });

    test('healthCheck should return data from the /health endpoint', async () => {
      const mockResponse = { response: "ok" };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await client.healthCheck();
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
    });
  });
});