import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { ActivatedRoute } from '@angular/router';
import { PostInterface } from '../../../shared/model';
import { Navbar } from '../navbar/navbar';
import { ToastService } from '../../services/toast-service';
import { ReusableNotFound } from '../reusable-not-found/reusable-not-found';

@Component({
  selector: 'app-edit-post',
  imports: [ReactiveFormsModule, CommonModule, Navbar, ReusableNotFound],
  templateUrl: './edit-post.html',
  styleUrl: './edit-post.scss'
})
export class EditPost implements OnInit {

  apiService = inject( ApiService )
  activatedRoute = inject( ActivatedRoute )
  selectedPostID: string = ''
  oldPostItem: PostInterface | null = null

  router = inject(Router)

  toastService = inject( ToastService )

  noPostItemFound: boolean = false;

  formSubmitted = false;

  errorInfoText = 'Oops, we could not load the details of your selected post because it was not on our server.....'
  goToHomeBtnText = 'Back to home'


  editForm = new FormGroup({
    postTitle: new FormControl('', [Validators.required, Validators.minLength(8)] ),
    postBody: new FormControl('', Validators.required)
  })


  ngOnInit(): void {
    this.selectedPostID = this.activatedRoute.snapshot.paramMap.get('postID')!;
    
    this.apiService.getPostDetails( this.selectedPostID as string ).subscribe({
      next: ( data => {
        this.oldPostItem = data
        this.editForm.patchValue({
          postTitle: this.oldPostItem.title,
          postBody: this.oldPostItem.body
        })
      }),
      error: ( err => { 
        this.noPostItemFound = true
      })
    })
    
  }


  handleEditPostItem() {
    this.formSubmitted = true;

    if( this.editForm.invalid ) {
      this.editForm.markAllAsTouched();
      return;
    }
    else {
      let updatedPost: PostInterface = {
        id: this.oldPostItem!.id,
        userId: this.oldPostItem!.userId,
        title: this.editForm.value.postTitle!,
        body: this.editForm.value.postBody!
      }
      this.apiService.editPost(Number.parseInt( this.selectedPostID ), updatedPost);
      this.toastService.showToast("Post updated successfully !...")
      setTimeout(() => {
        this.goToHome()
      }, 1500)
    }

  }


  goToHome() {
    this.router.navigate(['/'])
  }


}
