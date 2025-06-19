import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { PostInterface } from '../../../shared/model';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Pagination } from '../pagination/pagination';


@Component({
  selector: 'app-list-posts',
  imports: [ CommonModule, Navbar, Pagination ],
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
  totalPosts = 0
  totalPages = 0


  ngOnInit(): void {

    this.loadPosts();

    this.apiService.AllPostsArray$.subscribe({
      next: ( posts => this.PostsArray = posts)
    })

    this.apiService.totalPosts$.subscribe( total => {
      this.totalPosts = total
      this.totalPages = Math.ceil(this.totalPosts / this.limit);
    })

  }


  loadPosts() {
    this.apiService.fetchAllPosts(this.currentPage, this.limit)
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts();
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
