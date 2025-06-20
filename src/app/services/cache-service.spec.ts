import { CacheService } from './cache-service';
import { CacheEntry } from '../../shared/model';




fdescribe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    service = new CacheService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve cached data if not expired', () => {
    const key = 'test-key';
    const value = { message: 'hello' };

    service.set(key, value);
    const cached = service.get(key);

    expect(cached).toEqual(value);
  });

  it('should return null if cache entry does not exist', () => {
    const result = service.get('missing-key');
    expect(result).toBeNull();
  });

  it('should return null if cache entry is expired', () => {
    const key = 'expired-key';
    const value = { message: 'old' };

    // Simulate expired entry
    const expiredTimestamp = Date.now() - 10 * 60 * 1000; // 10 minutes ago
    (service as any)['cache'].set(key, {
      data: value,
      timestamp: expiredTimestamp
    } as CacheEntry);

    const result = service.get(key);
    expect(result).toBeNull();
  });

  it('should remove a specific key with clearKey()', () => {
    const key = 'clear-me';
    service.set(key, 'value');
    service.clearKey(key);

    expect(service.get(key)).toBeNull();
  });

  it('should clear all entries with clearAll()', () => {
    service.set('key1', 'value1');
    service.set('key2', 'value2');

    service.clearAll();

    expect(service.get('key1')).toBeNull();
    expect(service.get('key2')).toBeNull();
  });
});
