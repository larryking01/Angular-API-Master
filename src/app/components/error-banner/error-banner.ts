import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ErrorService } from '../../services/error-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-banner',
  imports: [CommonModule],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.scss'
})
export class ErrorBanner implements OnInit, OnDestroy {
  errorService = inject( ErrorService )

  errorExists: string | null = null

  private destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.errorService.errorMessageObservable.pipe( takeUntil( this.destroy$ ))
    .subscribe({
      next: ( data => {
        this.errorExists = data
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  dismiss() {
    this.errorService.clearErrorMessage()
  }

  constructor() {}




}
