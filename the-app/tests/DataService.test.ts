import { DataService } from '@/services/DataService';

// Mock fetch
global.fetch = jest.fn();

describe('DataService.checkHealth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when API is healthy (response.ok is true)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    
    const result = await DataService.checkHealth();
    
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith('http://10.0.2.2:8000/health');
  });

  it('returns false when API returns non-ok status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    
    const result = await DataService.checkHealth();
    
    expect(result).toBe(false);
  });

  it('returns false when fetch throws an error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    const result = await DataService.checkHealth();
    
    expect(result).toBe(false);
  });
});