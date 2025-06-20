import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListPosts } from './list-posts';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { ErrorService } from '../../services/error-service';
import { of } from 'rxjs';
import { PostInterface } from '../../../shared/model';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Pagination } from '../pagination/pagination';



fdescribe('ListPosts', () => {
  let component: ListPosts;
  let fixture: ComponentFixture<ListPosts>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPosts: PostInterface[] = [
    { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
    { id: 2, userId: 2, title: 'Post 2', body: 'Body 2' }
  ];

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'fetchAllPosts', 'deletePost', 'clearPostsCache'
    ], {
      AllPostsArray$: of(mockPosts),
      totalPosts$: of(20)
    });

    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn'], {
      isAuthenticated: jasmine.createSpy().and.returnValue(true)
    });

    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleAPIRequestError']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [CommonModule, Navbar, Pagination],
      declarations: [ListPosts],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(ListPosts);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    expect(apiServiceSpy.fetchAllPosts).toHaveBeenCalledWith(1, 10);
    expect(component.PostsArray.length).toBe(2);
    expect(component.totalPosts).toBe(20);
    expect(component.totalPages).toBe(2);
  });


  it('should call deletePost when deletePostItem is called', () => {
    component.selectedPostID = 1;
    component.showDeleteModal = true;

    component.deletePostItem(1);

    expect(apiServiceSpy.deletePost).toHaveBeenCalledWith(1);
    expect(component.showDeleteModal).toBeFalse();
    expect(component.selectedPostID).toBeNull();
  });
});
