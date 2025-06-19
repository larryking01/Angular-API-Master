import { Component, inject, OnInit, effect } from '@angular/core';
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

  // for pagination
  currentPage = 1
  limit = 10
  totalPosts = 100
  totalPages = 0


  ngOnInit(): void {

    this.loadPosts();

    this.apiService.AllPostsArray$.subscribe({
      next: ( posts => this.PostsArray = posts)
    })


  }

  loadPosts() {
    this.apiService.fetchAllPosts(this.currentPage, this.limit)
    this.totalPosts = this.apiService.totalPosts
    this.totalPages = Math.ceil(this.totalPosts / this.limit)
  }


  goToNext() {
    if( this.currentPage < this.totalPages ) {
      this.currentPage++
      this.loadPosts()
    }
  }

  goToPrevious() {
    if( this.currentPage > 1) {
      this.currentPage--
      this.loadPosts()
    }
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
