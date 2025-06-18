import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { ActivatedRoute } from '@angular/router';
import { PostInterface } from '../../../shared/model';



@Component({
  selector: 'app-edit-post',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-post.html',
  styleUrl: './edit-post.scss'
})
export class EditPost implements OnInit {

  apiService = inject( ApiService )
  activatedRoute = inject( ActivatedRoute )
  selectedPostID: string = ''
  oldPostItem: PostInterface | null = null

  updatedPostItem: PostInterface = {
    userId: 1000,
    id: 2000,
    title: "Radioactivity",
    body: "Science is exciting"
  }


  editForm = new FormGroup({
    postTitle: new FormControl('', Validators.required ),
    postBody: new FormControl('', Validators.required)
  })


  ngOnInit(): void {
    this.selectedPostID = this.activatedRoute.snapshot.paramMap.get('postID')!;
    console.log('edit post detail id = ', this.selectedPostID );
    
    this.apiService.getPostDetails( this.selectedPostID as string ).subscribe({
      next: ( data => {
        this.oldPostItem = data
        console.log("edit post detail = ", this.oldPostItem );
        this.editForm.patchValue({
          postTitle: this.oldPostItem.title,
          postBody: this.oldPostItem.body
        })
      }),
      error: ( err => console.log('edit error, cannot find post ', err ))
    })
    
  }


  handleEditPostItem() {
    this.editForm.markAllAsTouched();
    if( this.editForm.invalid ) {
      console.log('all fields are required')
    }
    else {
      console.log("old post = ", this.oldPostItem)
      let updatedPost: PostInterface = {
        id: this.oldPostItem!.id,
        userId: this.oldPostItem!.userId,
        title: this.editForm.value.postTitle!,
        body: this.editForm.value.postBody!
      }
      this.apiService.editPost(Number.parseInt( this.selectedPostID ), updatedPost);
      console.log("updated post = ", updatedPost)
    }

  }








}
