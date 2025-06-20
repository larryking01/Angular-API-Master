import { ErrorService } from './error-service';
import { fakeAsync, tick } from '@angular/core/testing';

fdescribe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    service = new ErrorService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit custom error string as message', (done) => {
    service.errorMessageObservable.subscribe((msg) => {
      if (msg) {
        expect(msg).toBe('Something went wrong!');
        done();
      }
    });

    service.handleAPIRequestError('Something went wrong!');
  });

  it('should emit Error instance message', (done) => {
    service.errorMessageObservable.subscribe((msg) => {
      if (msg) {
        expect(msg).toBe('Test error');
        done();
      }
    });

    service.handleAPIRequestError(new Error('Test error'));
  });

  it('should emit API error.message if present', (done) => {
    const error = { error: { message: 'Invalid request' } };

    service.errorMessageObservable.subscribe((msg) => {
      if (msg) {
        expect(msg).toBe('Invalid request');
        done();
      }
    });

    service.handleAPIRequestError(error);
  });

  it('should emit 404-specific message for status 404', (done) => {
    const error = { status: 404 };

    service.errorMessageObservable.subscribe((msg) => {
      if (msg) {
        expect(msg).toContain("couldn't find");
        done();
      }
    });

    service.handleAPIRequestError(error);
  });

  it('should emit default message for unknown error', (done) => {
    const error = { status: 999 };

    service.errorMessageObservable.subscribe((msg) => {
      if (msg) {
        expect(msg).toBe('An unexpected error occurred');
        done();
      }
    });

    service.handleAPIRequestError(error);
  });

  it('should clear the message after 4000ms', fakeAsync(() => {
    let messages: (string | null)[] = [];

    service.errorMessageObservable.subscribe((msg) => {
      messages.push(msg);
    });

    service.handleAPIRequestError('Temporary error');

    tick(0);
    expect(messages.at(-1)).toBe('Temporary error');

    tick(4000);
    expect(messages.at(-1)).toBeNull();
  }));

  // it('should clear the message manually with clearErrorMessage()', (done) => {
  //   service.errorMessageObservable.subscribe((msg) => {
  //     if (msg === null) {
  //       expect(msg).toBeNull();
  //       done();
  //     }
  //   });

  //   service.clearErrorMessage();
  // });
  
});
