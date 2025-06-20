import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from '../../services/toast-service';
import { Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';



fdescribe('Toast Component', () => {
  let fixture: ComponentFixture<Toast>;
  let component: Toast;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [Toast],
      providers: [ToastService],
    });

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display toast message when present', () => {
    toastService.toastMessage.set('This is a test toast!');
    fixture.detectChanges();

    const toastText = fixture.debugElement.nativeElement.textContent;
    expect(toastText).toContain('This is a test toast!');
  });

  it('should not display anything when message is null', () => {
    toastService.toastMessage.set(null);
    fixture.detectChanges();

    const toastEl = fixture.debugElement.query(By.css('.toast'));
    expect(toastEl).toBeNull(); // no toast element rendered
  });
});
