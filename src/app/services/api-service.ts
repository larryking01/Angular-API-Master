import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, throwError, retry, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PostInterface, CommentInterface } from '../../shared/model';
import { ErrorService } from './error-service';
import { CacheService } from './cache-service';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private AllPostsArray = new BehaviorSubject<PostInterface[]>([])
  AllPostsArray$ = this.AllPostsArray.asObservable()

  private totalPostsSubject = new BehaviorSubject<number>(0)
  totalPosts$ = this.totalPostsSubject.asObservable()

  httpClient = inject( HttpClient )
  errorService = inject( ErrorService )
  cacheService = inject( CacheService )

  baseUrl = `${ environment.apiBaseUrl }/posts`

  constructor() {}


  clearPostsCache() {
    this.cacheService.clearKey(this.baseUrl);
  }


  fetchAllPosts(page = 1, limit = 10) {


    const url = `${ this.baseUrl }?_page=${ page }&_limit=${ limit }`
    const cacheKey = url;

    const cachedData = this.cacheService.get(this.baseUrl);
    if (cachedData) {
      this.AllPostsArray.next(cachedData);
      return;
    }
    
    this.httpClient.get<PostInterface[]>( url, { observe: 'response' })
    .pipe(
      retry(2),
      catchError(( err ) => {
        this.errorService.handleAPIRequestError( err ); 
        return of({ body: [] })
      })
    )
    .subscribe(( res ) => {
      const posts = res.body ?? [];
      this.AllPostsArray.next( posts )


      if( res instanceof HttpResponse ) {
        const totalCount = res.headers.get('X-Total-Count');
        this.totalPostsSubject.next(Number( totalCount ))

      }

      this.cacheService.set( cacheKey, posts)

    
    })
  }





  createNewPost(post: PostInterface) {
    let currentPosts = this.AllPostsArray.getValue();
    this.httpClient.post<PostInterface>(this.baseUrl, post)
    .pipe(
      retry(2),
      catchError(( err ) => {
      this.errorService.handleAPIRequestError( err )
      return of( null ) 
    }))
    .subscribe((data) => {
      if( data ) {
        let updatedPosts = [ data, ...currentPosts ]
        this.AllPostsArray.next( updatedPosts )
        this.cacheService.set(this.baseUrl, updatedPosts);  
      }
    })
  }


  getPostDetails( postID: string ): Observable<PostInterface> {
    const url = `${this.baseUrl}/${postID}`;
    const cachedData = this.cacheService.get(url);

    if (cachedData) {
      return of(cachedData); 
    }


    return this.httpClient.get<PostInterface>(`${this.baseUrl}/${ postID }`).pipe(
      retry(2),
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return throwError(() => error ) 
      }),
      tap((data) => {
        this.cacheService.set(url, data);
      })
      )

  }


  deletePost( postID: number ) {
    this.httpClient.delete<void>(`${this.baseUrl}/${ postID }`)
    .pipe(
      catchError((error) => {
        this.errorService.handleAPIRequestError( error );
        return of( null ) 
      })
    )
    .subscribe({
      next: ( data => {
        if(!data) return 

        let currentPosts = this.AllPostsArray.getValue()
        let filteredPosts = currentPosts.filter( post => post.id !== postID );
        this.AllPostsArray.next( filteredPosts )

        this.cacheService.set(this.baseUrl, filteredPosts);
      })
    })
  }



  editPost( oldPostID: number, updatedPost: PostInterface ) {
    let oldPost;
    this.httpClient.put<PostInterface>(`${this.baseUrl}/${ oldPostID }`, updatedPost)
    .pipe(
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return of( null )
      })
    )
    .subscribe({
      next: (data => {
        if (!data) return  

        oldPost = data;

        let currentItems = this.AllPostsArray.getValue()
        let indexOfPostToEdit = currentItems.findIndex( postItem => postItem.id === oldPostID )
        currentItems[ indexOfPostToEdit ] = updatedPost
        this.AllPostsArray.next( currentItems )

        this.cacheService.set(this.baseUrl, currentItems);
      })
    })

  }


  getPostComments(postID: string): Observable<CommentInterface[]> {
    const url = `${this.baseUrl}/${postID}/comments`;
    const cachedData = this.cacheService.get(url);

    if (cachedData) {
      return of(cachedData); 
    }

    return this.httpClient.get<CommentInterface[]>(`${this.baseUrl}/${ postID }/comments`)
    .pipe(
      retry(2),
      tap((data) => {
        this.cacheService.set(url, data);
      }),
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return throwError(() => error )
      })
    )
  }


}
