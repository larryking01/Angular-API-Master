import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-navbar',
  imports: [ CommonModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  authService = inject(AuthService);

  router = inject( Router )

  isLoggedIn = computed(() => this.authService.isAuthenticated());

  login() {
    this.authService.login();
    this.router.navigate(['/']); 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }


  goToHome() {
    this.router.navigate(['/'])
  }

}
