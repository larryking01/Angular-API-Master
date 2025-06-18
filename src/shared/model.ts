interface PostInterface {
    userId: number,
    id: number,
    title: string,
    body: string
}

interface CommentInterface {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}



export type {
    PostInterface,
    CommentInterface
}