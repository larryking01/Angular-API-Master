import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { PostInterface } from '../../../shared/model';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Pagination } from '../pagination/pagination';
import { ErrorService } from '../../services/error-service';
import { AuthService } from '../../services/auth-service';


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

  authService = inject( AuthService )

  errorService = inject( ErrorService )

  isLoggedIn = computed(() => this.authService.isAuthenticated());

  showDeleteModal: boolean = false;

  selectedPostID: number | null = null;

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
    if( !this.isLoggedIn() ) {
      let error = new Error("Login is required to create a post")
      this.errorService.handleAPIRequestError(error)
    }
    else {
      this.router.navigate(['create-post'])
    }

  }


  navigateToEditPost(postId: number) {
    if( !this.isLoggedIn() ) {
      let error = new Error("Login is required to edit a post")
      this.errorService.handleAPIRequestError(error)
    }
    else {
      this.router.navigate(['edit-post', postId])
    }

  }

  
  navigateToPostDetails(postId: number) {
    if( !this.isLoggedIn() ) {
      let error = new Error("Login is required to use this feature")
      this.errorService.handleAPIRequestError(error)
    }
    else {
      this.router.navigate(['post-details', postId])
    }
  }


  deletePostItem(postId: number) {
      this.apiService.deletePost( postId )
      this.closeDeleteModal()
  }
  

  clearPostsCache() {
    this.apiService.clearPostsCache()
  }


  openDeleteModal(postID: number) {
    if( !this.isLoggedIn() ) {
      let error = new Error("Login is required to delete a post")
      this.errorService.handleAPIRequestError(error)
    }
    else {
      this.selectedPostID = postID;
      this.showDeleteModal = true
    }
  }

  closeDeleteModal() {
    this.selectedPostID = null
    this.showDeleteModal = false
  }
  

}
