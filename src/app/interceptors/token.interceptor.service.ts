import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(!request.url.includes('https://api.generadordni.es/v2/holidays/holidays?')){
      
    const token = this.storageService.getLocalStorageItem('token') as String;
    (token)
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } 
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authService.logOut();
        }
        const error = err.error.message || err.statusText;
         throw new Error(error);
        ;
      })
    );
  }
}