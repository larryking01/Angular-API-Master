import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReusableNotFound } from './reusable-not-found';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';



fdescribe('ReusableNotFound Component', () => {
  let component: ReusableNotFound;
  let fixture: ComponentFixture<ReusableNotFound>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ReusableNotFound],
      providers: [{ provide: Router, useValue: mockRouter }]
    });

    fixture = TestBed.createComponent(ReusableNotFound);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided error text and button label', () => {
    component.errorInfoText = 'Something went wrong';
    component.goToHomeBtnText = 'Go Back';
    fixture.detectChanges();

    const errorText = fixture.nativeElement.querySelector('h3')?.textContent;
    const buttonText = fixture.nativeElement.querySelector('button')?.textContent;

    expect(errorText).toContain('Something went wrong');
    expect(buttonText).toContain('Go Back');
  });

  it('should navigate to home when button is clicked', () => {
    component.goToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call goToHome() when button is clicked from template', () => {
    component.goToHomeBtnText = 'Home';
    component.errorInfoText = 'Error';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
