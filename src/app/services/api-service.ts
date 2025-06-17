import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostInterface } from '../../shared/model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private AllPostsArray = new BehaviorSubject<PostInterface[]>([])
  AllPostsArray$ = this.AllPostsArray.asObservable()

  httpClient = inject( HttpClient )

  constructor() {
    this.fetchAllPosts()
   }


  fetchAllPosts() {
    this.httpClient.get<PostInterface[]>('https://jsonplaceholder.typicode.com/posts')
    .subscribe({
      next: ( data => this.AllPostsArray.next( data ))
    })
  }


  createNewPost(post: PostInterface) {
    let currentPosts = this.AllPostsArray.getValue();
    let newPostObservable = this.httpClient.post<PostInterface>('https://jsonplaceholder.typicode.com/posts', post);
    newPostObservable.subscribe({
      next: ( data => {
        let updatedPosts = [ data, ...currentPosts ]
        this.AllPostsArray.next( updatedPosts )
      }
    ),
    error: ( err => console.log('error, data not found ', err))
    })
  }


  getPostDetails( postID: string ): Observable<PostInterface> {
    return this.httpClient.get<PostInterface>(`https://jsonplaceholder.typicode.com/posts/${ postID }`)
  }


  deletePost( postID: number ) {
    this.httpClient.delete<PostInterface>(`https://jsonplaceholder.typicode.com/posts/${ postID }`)
    .subscribe({
      next: ( data => {
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
    .subscribe({
      next: (data => {
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


  getPostComments(postID: string): Observable<any> {
    return this.httpClient.get<PostInterface[]>(`https://jsonplaceholder.typicode.com/posts/${ postID }/comments`)
  }




}
