import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostInterface } from '../../../shared/model';
import { ApiService } from '../../services/api-service';
import { Navbar } from '../navbar/navbar';
import { ToastService } from '../../services/toast-service';


@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss'
})
export class CreatePost {

  apiService = inject(ApiService);

  toastService = inject( ToastService );

  router = inject( Router );


  postForm = new FormGroup({
    postTitle: new FormControl('', Validators.required),
    postBody: new FormControl('', Validators.required)
  })


  submitPost() {
    this.postForm.markAllAsTouched();
    
    if( this.postForm.invalid ) {
      console.log("all fields are required")
    } else {
      console.log("form value = ", this.postForm.value );
      let newPost: PostInterface = {
        userId: Math.random() * 100,
        id: Math.random() * 200,
        title: this.postForm.value.postTitle!,
        body: this.postForm.value.postBody!
      }

      this.apiService.createNewPost( newPost );
      this.postForm.reset();
      this.toastService.showToast("Post created successfully !...")
      setTimeout(() => {
        this.goToHome()
        
      }, 1000)
    }
    
  }


  goToHome() {
    this.router.navigate(['/'])
  }



}
