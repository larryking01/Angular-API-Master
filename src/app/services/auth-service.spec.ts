import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';



fdescribe('AuthService', () => {
  let service: AuthService;
  const tokenKey = 'auth_token';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token and update signal on login()', () => {
    service.login();

    expect(localStorage.getItem(tokenKey)).toBe('mock-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should remove token and update signal on logout()', () => {
    localStorage.setItem(tokenKey, 'mock-token'); // pre-set token
    service.logout();

    expect(localStorage.getItem(tokenKey)).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return token from getToken()', () => {
    localStorage.setItem(tokenKey, 'abc123');
    expect(service.getToken()).toBe('abc123');
  });

  it('should return true for isLoggedIn() if token exists', () => {
    localStorage.setItem(tokenKey, 'abc123');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn() if token is missing', () => {
    localStorage.removeItem(tokenKey);
    expect(service.isLoggedIn()).toBeFalse();
  });
});
