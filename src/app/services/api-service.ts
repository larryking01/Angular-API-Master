import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostInterface, CommentInterface } from '../../shared/model';
import { ErrorService } from './error-service';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private AllPostsArray = new BehaviorSubject<PostInterface[]>([])
  AllPostsArray$ = this.AllPostsArray.asObservable()

  httpClient = inject( HttpClient )

  errorService = inject( ErrorService )

  constructor() {
    this.fetchAllPosts()
   }


  fetchAllPosts() {
    this.httpClient.get<PostInterface[]>('https://jsonplaceholder.typicode.com/posts')
    .pipe(
      catchError(( err ) => {
        this.errorService.handleAPIRequestError( err ); // centralized error handling
        return of([]) // fallback value to avoid app craching
      })
    )
    .subscribe({
      next: ( data => this.AllPostsArray.next( data )),
      
    })
  }


  createNewPost(post: PostInterface) {
    let currentPosts = this.AllPostsArray.getValue();
    this.httpClient.post<PostInterface>('https://jsonplaceholder.typicode.com/posts', post)
    .pipe(catchError(( err ) => {
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
    return this.httpClient.get<PostInterface>(`https://jsonplaceholder.typicode.com/posts/${ postID }`).pipe(
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return throwError(() => error )  // re-throw so the component can handle it too
      })
    )

  }


  deletePost( postID: number ) {
    this.httpClient.delete<void>(`https://jsonplaceholder.typicode.com/posts/${ postID }`)
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
    this.httpClient.put<PostInterface>(`https://jsonplaceholder.typicode.com/posts/${ oldPostID }`, updatedPost)
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
    return this.httpClient.get<CommentInterface[]>(`https://jsonplaceholder.typicode.com/posts/${ postID }/comments`)
    .pipe(
      catchError(( error ) => {
        this.errorService.handleAPIRequestError( error );
        return throwError(() => error )
      })
    )
  }




}
