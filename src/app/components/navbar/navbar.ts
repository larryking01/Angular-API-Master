import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'



@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  router = inject( Router )


  goToHome() {
    this.router.navigate(['/'])
  }

}
