import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreatePost } from './create-post';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { ToastService } from '../../services/toast-service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';



fdescribe('CreatePost', () => {
  let component: CreatePost;
  let fixture: ComponentFixture<CreatePost>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['createNewPost']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule],
      declarations: [CreatePost],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(CreatePost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.postForm.value).toEqual({ postTitle: '', postBody: '' });
    expect(component.postForm.valid).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    component.submitPost();

    expect(component.postForm.invalid).toBeTrue();
    expect(apiServiceSpy.createNewPost).not.toHaveBeenCalled();
  });

});
