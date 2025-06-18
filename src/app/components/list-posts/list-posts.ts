import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { PostInterface } from '../../../shared/model';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';



@Component({
  selector: 'app-list-posts',
  imports: [ CommonModule, Navbar ],
  templateUrl: './list-posts.html',
  styleUrl: './list-posts.scss'
})
export class ListPosts implements OnInit {
  PostsArray: PostInterface[] = [];

  apiService = inject(ApiService);

  router = inject(Router);

  ngOnInit(): void {

    // this.apiService.clearPostsCache();
    this.apiService.fetchAllPosts();


    this.apiService.AllPostsArray$.subscribe({
      next: (( data: PostInterface[]) => {
        this.PostsArray = data;
        console.log('all posts = ', this.PostsArray)
      })

    })
  }


  navigateToCreateNewPost() {
    this.router.navigate(['create-post'])
  }


  navigateToEditPost(postId: number) {
    this.router.navigate(['edit-post', postId])
  }

  
  navigateToPostDetails(postId: number) {
    this.router.navigate(['post-details', postId])
  }


  deletePostItem(postId: number) {
    this.apiService.deletePost( postId )
  }
  

  clearPostsCache() {
    this.apiService.clearPostsCache()
  }




}
