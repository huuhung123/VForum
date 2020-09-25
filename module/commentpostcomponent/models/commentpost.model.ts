export interface ICommentPostCreateForm {
  id: string;
  description: string;
  postId: string;
  createdAt: string;
  createdBy: string;
  userId: string;
}

export interface ICommentPostUpdateForm {
  id: string;
  description: string;
  updatedAt: string;
  isUpdated: boolean;
}
