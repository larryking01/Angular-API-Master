import { Routes } from '@angular/router';
import { ListPosts } from './components/list-posts/list-posts';
import { EditPost } from './components/edit-post/edit-post';
import { PostDetails } from './components/post-details/post-details';
import { CreatePost } from './components/create-post/create-post';
import { NotFound } from './components/not-found/not-found';


export const routes: Routes = [
    {
        path: '',
        component: ListPosts,
        title: 'List Posts'
    },
    {
        path: 'create-post',
        component: CreatePost,
        title: 'Create Post'
    },
    {
        path: 'post-details/:postID',
        component: PostDetails,
        title: 'Post Details'
    },
    {
        path: 'edit-post/:postID',
        component: EditPost,
        title: 'Edit Post'
    },
    {
        path: '**',
        component: NotFound,
        title: 'Page Not Found'
    }
];
