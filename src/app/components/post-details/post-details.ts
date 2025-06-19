import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { PostInterface } from '../../../shared/model';
import { Navbar } from '../navbar/navbar';


@Component({
  selector: 'app-post-details',
  imports: [Navbar],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss'
})
export class PostDetails implements OnInit {

  activatedRoute = inject(ActivatedRoute);

  apiService = inject(ApiService);

  postComments: any = [];

  postDetail: PostInterface | null = null;


  ngOnInit(): void {
    let selectedPostID = this.activatedRoute.snapshot.paramMap.get('postID');
    console.log('post detail id = ', selectedPostID );

    
    
    this.apiService.getPostDetails( selectedPostID as string ).subscribe({
      next: ( data => {
        this.postDetail = data;
        console.log("post detail = ", this.postDetail )
      }),
      error: ( err => console.log('error, cannot find post ', err ))
    })


    this.apiService.getPostComments(selectedPostID as string).subscribe({
      next: ( data => {
        this.postComments = data;
        console.log('comments for selected post', this.postComments)
      })
    })

    

  }

}
