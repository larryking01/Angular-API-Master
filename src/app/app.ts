import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBanner } from './components/error-banner/error-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  constructor() {}


}
