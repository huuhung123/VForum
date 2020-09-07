export interface ICommentPostCreateForm {
  id: string;
  description: string;
  postId: string;
  createdAt: string;
  createdBy: string
}

export interface ICommentPostUpdateForm {
  id: string;
  description: string;
  postId: string;
  updatedAt: string;
  updatedBy: string
}
