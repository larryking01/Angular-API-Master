import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reusable-not-found',
  imports: [],
  templateUrl: './reusable-not-found.html',
  styleUrl: './reusable-not-found.scss'
})
export class ReusableNotFound {

  @Input() errorInfoText: string = ''
  @Input() goToHomeBtnText: string = ''
  // @Input() notFoundImage: string = ''

  router = inject( Router )

  goToHome() {
    this.router.navigate(['/'])
  }

}
