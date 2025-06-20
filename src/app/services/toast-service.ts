import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toastMessage = signal<string | null>( null );

  showToast(message: string, duration = 3000) {
    this.toastMessage.set( message )

    setTimeout(() => {
      this.toastMessage.set( null )
    }, duration)

  }

}
