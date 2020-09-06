export interface ICommentPostCreateForm {
  id: string;
  description: string;
  postId: string;
  createdAt: string;
  // createdBy: object
}

export interface ICommentPostUpdateForm {
  id: string;
  description: string;
  postId: string;
  updatedAt: string;
  // updatedBy: object
}
