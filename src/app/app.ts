import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBanner } from './components/error-banner/error-banner';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorBanner, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  constructor() {}


}
