import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditPost } from './edit-post';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { ToastService } from '../../services/toast-service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostInterface } from '../../../shared/model';



fdescribe('EditPost', () => {
  let component: EditPost;
  let fixture: ComponentFixture<EditPost>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockPost: PostInterface = {
    id: 10,
    userId: 1,
    title: 'Existing Post Title',
    body: 'Existing body'
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getPostDetails', 'editPost']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule],
      declarations: [EditPost],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '10'
              }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(EditPost);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post details and patch form', fakeAsync(() => {
    apiServiceSpy.getPostDetails.and.returnValue(of(mockPost));

    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.oldPostItem).toEqual(mockPost);
    expect(component.editForm.value.postTitle).toBe('Existing Post Title');
    expect(component.editForm.value.postBody).toBe('Existing body');
    expect(component.noPostItemFound).toBeFalse();
  }));

  it('should show not found state when post fetch fails', fakeAsync(() => {
    apiServiceSpy.getPostDetails.and.returnValue(throwError(() => ({ status: 404 })));

    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.noPostItemFound).toBeTrue();
  }));

  it('should not submit if form is invalid', () => {
    fixture.detectChanges();

    component.editForm.setValue({ postTitle: '', postBody: '' });
    component.handleEditPostItem();

    expect(apiServiceSpy.editPost).not.toHaveBeenCalled();
    expect(component.editForm.invalid).toBeTrue();
  });

});
