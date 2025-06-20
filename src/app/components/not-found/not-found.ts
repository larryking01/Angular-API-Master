import { Component } from '@angular/core';
import { ReusableNotFound } from '../reusable-not-found/reusable-not-found';

@Component({
  selector: 'app-not-found',
  imports: [ReusableNotFound],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {

  errorInfoText = "Oops! Page not found. The page you're looking for doesn't exist or has been moved.";
  goToHomeBtnText = 'Back to home'

}
