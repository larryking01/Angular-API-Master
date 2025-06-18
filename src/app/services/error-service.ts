import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>( null );
  errorMessageObservable = this.errorMessage.asObservable();

  message = 'An unexpected error occurred'

  constructor() { }

  handleAPIRequestError( error: any ) {
    if(error?.error?.message) {
      this.message = error.error.message
    }
    else {
      switch( error.status ) {
        case 404:
          this.message = 'Sorry, requested resource was not found'
          break
        case 500:
          this.message = 'Server error. Please try again later.'
          break
        case 0:
          this.message = 'Network error. Please check your internet connection.'
          break
        default:
          this.message = 'An unexpected error occurred'
      }
    }

    this.errorMessage.next( this.message )

    setTimeout(() => {
      this.errorMessage.next( null )

    }, 4000)

  }


  clearErrorMessage(): void {
    this.errorMessage.next(null);
  }
  
}
