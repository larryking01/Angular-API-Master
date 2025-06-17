import { Component, inject } from '@angular/core';
import { PostInterface } from '../../../shared/model';
import { ApiService } from '../../services/api-service';



@Component({
  selector: 'app-create-post',
  imports: [],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss'
})
export class CreatePost {

  apiService = inject(ApiService);

  postData: PostInterface = {
    userId: 200,
    id: 300,
    title: "Football",
    body: 'Football is great'
  }


  submitPost() {
    this.apiService.createNewPost( this.postData )
  }



}
