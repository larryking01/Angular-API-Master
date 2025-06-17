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
      })
    })
  }


  getPostDetails( post: PostInterface ) {
    
  }




}
