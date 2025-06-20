import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFound } from './not-found';
import { ReusableNotFound } from '../reusable-not-found/reusable-not-found';
import { Component } from '@angular/core';



fdescribe('NotFound Component', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableNotFound],
      declarations: [NotFound],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the NotFound component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct error info text', () => {
    expect(component.errorInfoText).toContain('Oops! Page not found');
  });

  it('should have the correct home button text', () => {
    expect(component.goToHomeBtnText).toBe('Back to home');
  });

  it('should render the ReusableNotFound component in the template', () => {
    const reusable = fixture.nativeElement.querySelector('app-reusable-not-found');
    expect(reusable).not.toBeNull();
  });
});
