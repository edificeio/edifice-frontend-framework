// we need to import axios to mock it
import axios from 'axios';
import { IOdeServices } from '../services/OdeServices';
import { HttpService } from './Service';

describe('HttpService', () => {
  let httpService: HttpService;
  let mockContext: IOdeServices;

  beforeEach(() => {
    mockContext = {
      conf: () => ({
        getCdnUrl: () => 'http://cdn.example.com',
      }),
    } as IOdeServices;
    httpService = new HttpService(mockContext);
  });

  it('should fix base URL correctly', () => {
    httpService.useBaseUrl('http://example.com');
    expect(httpService['fixBaseUrl']('/test')).toBe('http://example.com/test');
  });

  it('should handle absolute URLs correctly', () => {
    expect(httpService['fixBaseUrl']('http://example.com/test')).toBe(
      'http://example.com/test',
    );
  });

  it('should map Axios error correctly', async () => {
    const error = {
      response: {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        data: 'Not Found',
      },
    } as any;
    const result = httpService['mapAxiosError'](error);
    expect(result).toBe('Not Found');
  });

  it('should map Axios response correctly', async () => {
    const response = {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: 'Success',
    } as any;
    const result = httpService['mapAxiosResponse'](response);
    expect(result).toBe('Success');
  });

  it('should make a GET request successfully', async () => {
    const response = { data: 'Success' };
    // use vi.spyOn to use mockced axios
    vi.spyOn(axios, 'get').mockResolvedValue(response);
    const result = await httpService.get('/test');
    expect(result).toEqual(response);
  });

  it('should handle GET request error', async () => {
    const error = {
      response: {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        data: 'Not Found',
      },
    };
    // use vi.spyOn to use mockced axios
    vi.spyOn(axios, 'get').mockRejectedValue(error);
    await expect(httpService.get('/test-error')).rejects.toThrow('Not Found');
  });
});
