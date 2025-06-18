interface PostInterface {
    userId: number,
    id: number,
    title: string,
    body: string
}

interface CommentInterface {
  postId: number,
  id: number,
  name: string,
  email: string,
  body: string,
}


interface CacheEntry {
    data: any,
    timestamp: number
}



export type {
    PostInterface,
    CommentInterface,
    CacheEntry
}