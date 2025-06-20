import { TestBed } from '@angular/core/testing';
import { ApiService } from './api-service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CacheService } from './cache-service';
import { ErrorService } from './error-service';
import { PostInterface } from '../../shared/model';



fdescribe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let cacheService: jasmine.SpyObj<CacheService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  const mockPosts: PostInterface[] = [
    { id: 1, title: 'Test Post', body: 'Lorem ipsum', userId: 1 },
    { id: 2, title: 'Another Post', body: 'Body content', userId: 1 }
  ];

  beforeEach(() => {
    const cacheSpy = jasmine.createSpyObj('CacheService', ['get', 'set', 'clearKey']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['handleAPIRequestError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: CacheService, useValue: cacheSpy },
        { provide: ErrorService, useValue: errorSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService) as jasmine.SpyObj<CacheService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



fdescribe('fetchAllPosts', () => {
    it('should fetch posts and set them if not cached', () => {
      cacheService.get.and.returnValue(null);
      service.fetchAllPosts(1, 10);

      const req = httpMock.expectOne(`${service['baseUrl']}?_page=1&_limit=10`);
      expect(req.request.method).toBe('GET');

      req.flush(mockPosts, {
        headers: { 'X-Total-Count': '100' },
        status: 200,
        statusText: 'OK'
      });

      service.AllPostsArray$.subscribe((posts) => {
        expect(posts.length).toBe(2);
        expect(posts[0].title).toBe('Test Post');
      });
    });

    it('should load posts from cache if available', () => {
      cacheService.get.and.returnValue(mockPosts);
      service.fetchAllPosts(1, 10);

      service.AllPostsArray$.subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
      });

      httpMock.expectNone(`${service['baseUrl']}?_page=1&_limit=10`);
    });
  });


fdescribe('getPostDetails', () => {
    it('should fetch post details and cache them', () => {
      const post = mockPosts[0];
      const postUrl = `${service['baseUrl']}/${post.id}`;
      cacheService.get.and.returnValue(null);

      service.getPostDetails(String(post.id)).subscribe((result) => {
        expect(result).toEqual(post);
      });

      const req = httpMock.expectOne(postUrl);
      expect(req.request.method).toBe('GET');
      req.flush(post);

      expect(cacheService.set).toHaveBeenCalledWith(postUrl, post);
    });

    it('should return cached post details if available', (done) => {
      const post = mockPosts[0];
      const postUrl = `${service['baseUrl']}/${post.id}`;
      cacheService.get.and.returnValue(post);

      service.getPostDetails(String(post.id)).subscribe((result) => {
        expect(result).toEqual(post);
        done();
      });

      httpMock.expectNone(postUrl);
    });
  });


  
fdescribe('getPostComments', () => {
    it('should fetch comments and cache them', () => {
      const commentsUrl = `${service['baseUrl']}/1/comments`;
      const comments = [{ id: 1, body: 'Nice', postId: 1, name: '', email: '' }];
      cacheService.get.and.returnValue(null);

      service.getPostComments('1').subscribe((res) => {
        expect(res.length).toBe(1);
        expect(res[0].body).toBe('Nice');
      });

      const req = httpMock.expectOne(commentsUrl);
      expect(req.request.method).toBe('GET');
      req.flush(comments);
      expect(cacheService.set).toHaveBeenCalledWith(commentsUrl, comments);
    });
  });
});
