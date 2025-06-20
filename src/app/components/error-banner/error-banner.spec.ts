import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorBanner } from './error-banner';
import { ErrorService } from '../../services/error-service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';



fdescribe('ErrorBanner Component', () => {
  let component: ErrorBanner;
  let fixture: ComponentFixture<ErrorBanner>;
  let mockErrorSubject: BehaviorSubject<string | null>;
  let errorService: ErrorService;

  beforeEach(async () => {
    mockErrorSubject = new BehaviorSubject<string | null>(null);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ErrorBanner],
      providers: [
        {
          provide: ErrorService,
          useValue: {
            errorMessageObservable: mockErrorSubject.asObservable(),
            clearErrorMessage: jasmine.createSpy('clearErrorMessage'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorBanner);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message when emitted', () => {
    const errorMsg = 'Something went wrong';
    mockErrorSubject.next(errorMsg);
    fixture.detectChanges();

    const errorText = fixture.debugElement.nativeElement.textContent;
    expect(errorText).toContain(errorMsg);
  });

});
