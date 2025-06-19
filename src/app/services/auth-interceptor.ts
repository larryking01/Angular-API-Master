import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth-service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Clone the request and add Authorization header if token exists
    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    // Log request
    console.log('🔼 Outgoing Request:', authReq);

    return next.handle(authReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Log response
          console.log('🔽 Incoming Response:', event);
        }
      })
    );
  }
}
