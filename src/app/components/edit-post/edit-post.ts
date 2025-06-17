import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { ActivatedRoute } from '@angular/router';
import { PostInterface } from '../../../shared/model';



@Component({
  selector: 'app-edit-post',
  imports: [],
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
    body: "Science sucks"
  }

  ngOnInit(): void {
    this.selectedPostID = this.activatedRoute.snapshot.paramMap.get('postID')!;
    console.log('edit post detail id = ', this.selectedPostID );

    let postDetail;
    
    this.apiService.getPostDetails( this.selectedPostID as string ).subscribe({
      next: ( data => {
        this.oldPostItem = data
        console.log("edit post detail = ", this.oldPostItem );
      }),
      error: ( err => console.log('edit error, cannot find post ', err ))
    })
    
  }


  handleEditPostItem() {
    this.apiService.editPost(Number.parseInt( this.selectedPostID ), this.updatedPostItem);
  }








}
