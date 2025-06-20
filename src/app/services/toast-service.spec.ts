import { ToastService } from './toast-service';
import { fakeAsync, tick } from '@angular/core/testing';

fdescribe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a toast message', () => {
    service.showToast('Hello world');
    expect(service.toastMessage()).toBe('Hello world');
  });

  it('should clear the toast message after default duration (3000ms)', fakeAsync(() => {
    service.showToast('Goodbye');

    tick(0);
    expect(service.toastMessage()).toBe('Goodbye');

    tick(3000);
    expect(service.toastMessage()).toBeNull();
  }));

  it('should clear the toast after a custom duration', fakeAsync(() => {
    service.showToast('Short message', 1000);

    tick(0);
    expect(service.toastMessage()).toBe('Short message');

    tick(1000);
    expect(service.toastMessage()).toBeNull();
  }));
});
