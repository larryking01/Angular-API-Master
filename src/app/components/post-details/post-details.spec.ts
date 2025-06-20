import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetails } from './post-details';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../services/api-service';
import { PostInterface } from '../../../shared/model';
import { ReusableNotFound } from '../reusable-not-found/reusable-not-found';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';



fdescribe('PostDetails Component', () => {
  let component: PostDetails;
  let fixture: ComponentFixture<PostDetails>;

  const mockPost: PostInterface = {
    id: 1,
    userId: 1,
    title: 'Mock Title',
    body: 'Mock Body'
  };

  const mockComments = [
    { postId: 1, id: 1, name: 'Commenter 1', body: 'Nice post' },
    { postId: 1, id: 2, name: 'Commenter 2', body: 'Great read' }
  ];

  const mockApiService = {
    getPostDetails: jasmine.createSpy().and.returnValue(of(mockPost)),
    getPostComments: jasmine.createSpy().and.returnValue(of(mockComments))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, Navbar, ReusableNotFound],
      declarations: [PostDetails],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1' // simulate postID param
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the PostDetails component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPostDetails and populate postDetail', () => {
    expect(mockApiService.getPostDetails).toHaveBeenCalledWith('1');
    expect(component.postDetail).toEqual(mockPost);
  });

  it('should call getPostComments and populate postComments', () => {
    expect(mockApiService.getPostComments).toHaveBeenCalledWith('1');
    expect(component.postComments.length).toBe(2);
  });

  it('should set noPostDetailFound to true if post is not found', () => {
    // simulate error
    mockApiService.getPostDetails = jasmine.createSpy().and.returnValue(throwError(() => new Error('404')));
    fixture = TestBed.createComponent(PostDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.noPostDetailFound).toBeTrue();
  });
});
