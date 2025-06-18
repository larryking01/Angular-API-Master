import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, throwError, retry, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostInterface, CommentInterface } from '../../shared/model';
import { ErrorService } from './error-service';
import { CacheService } from './cache-service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private AllPostsArray = new BehaviorSubject<PostInterface[]>([])
  AllPostsArray$ = this.AllPostsArray.asObservable()

  httpClient = inject( HttpClient )
  errorService = inject( ErrorService )
  cacheService = inject( CacheService )

  baseUrl = 'https://jsonplaceholder.typicode.com/posts'


  constructor() {
    // this.fetchAllPosts()
   }


  clearPostsCache() {
    console.log("all cache cleared")
    this.cacheService.clearKey(this.baseUrl);
  }


  fetchAllPosts() {

    // const cacheKey = url;
    const cachedData = this.cacheService.get(this.baseUrl);

    if (cachedData) {
      this.AllPostsArray.next(cachedData);
      console.log('[CACHE] Loaded posts from cache');
      return;
    }
    
    this.httpClient.get<PostInterface[]>(this.baseUrl)
    .pipe(
      retry(2),
      catchError(( err ) => {
        this.errorService.handleAPIRequestError( err ); // centralized error handling
        return of([]) // fallback value to avoid app craching
      })
    )
    // .subscribe({
    //   next: ( data => this.AllPostsArray.next( data )),
    // })
    .subscribe((data) => {
      this.AllPostsArray.next(data);
      this.cacheService.set(this.baseUrl, data);
      console.log('[API] Fetched posts and cached them');
    });
  }


  createNewPost(post: PostInterface) {
    let currentPosts = this.AllPostsArray.getValue();
    this.httpClient.post<PostInterface>(this.baseUrl, post)
    .pipe(
      retry(2),
      catchError(( err ) => {
      this.errorService.handleAPIRequestError( err )
      return of( null ) // so the app can continue
    }))
    // .subscribe({
    //   next: ( data => {
    //     let updatedPosts = [ data, ...currentPosts ]
    //     this.AllPostsArray.next( updatedPosts )
    //   }
    // )
    
    // })
    .subscribe((data) => {
      if( data ) {
        let updatedPosts = [ data, ...currentPosts ]
        this.AllPostsArray.next( updatedPosts )
      }
    })
  }


  getPostDetails( postID: string ): Observable<PostInterface> {
    const url = `${this.baseUrl}/${postID}`;
    const cachedData = this.cacheService.get(url);

    if (cachedData) {
      console.log(`[CACHE] Loaded post ${postID} from cache`);
      return of(cachedData); // Return cached result as Observable
    }


    return this.httpClient.get<PostInterface>(`${this.baseUrl}/${ postID }`).pipe(
      retry(2),
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return throwError(() => error )  // re-throw so the component can handle it too
      }),
      // Store result in cache
      // Use tap() to cache the successful response before emitting
      // (avoids side effects inside subscribe)
      // But since you want to return an Observable, we use tap here
      tap((data) => {
        this.cacheService.set(url, data);
        console.log(`[API] Fetched and cached post ${postID}`);
      })
      )

  }


  deletePost( postID: number ) {
    this.httpClient.delete<void>(`${this.baseUrl}/${ postID }`)
    .pipe(
      catchError((error) => {
        this.errorService.handleAPIRequestError( error );
        return of( null ) // fallback, allows .subscribe() to run smoothly
      })
    )
    .subscribe({
      next: ( data => {
        if(!data) return  // prevent updating the list if deletion failed

        console.log("deleted post = ", data )
        let currentPosts = this.AllPostsArray.getValue()
        let filteredPosts = currentPosts.filter( post => post.id !== postID );
        this.AllPostsArray.next( filteredPosts )
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
        if (!data) return  // prevent updating the list if deletion failed

        oldPost = data;
        console.log("old post = ", oldPost)
        console.log("new post = ", updatedPost )

        let currentItems = this.AllPostsArray.getValue()
        let indexOfPostToEdit = currentItems.findIndex( postItem => postItem.id === oldPostID )
        currentItems[ indexOfPostToEdit ] = updatedPost
        this.AllPostsArray.next( currentItems )
      })
    })

  }


  getPostComments(postID: string): Observable<CommentInterface[]> {
    const url = `${this.baseUrl}/${postID}/comments`;
    const cachedData = this.cacheService.get(url);

    if (cachedData) {
      console.log(`[CACHE] Loaded comments for post ${postID}`);
      return of(cachedData); // Return cached Observable
    }

    return this.httpClient.get<CommentInterface[]>(`${this.baseUrl}/${ postID }/comments`)
    .pipe(
      retry(2),
      tap((data) => {
        this.cacheService.set(url, data);
        console.log(`[API] Fetched and cached comments for post ${postID}`);
      }),
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return throwError(() => error )
      })
    )
  }




}
