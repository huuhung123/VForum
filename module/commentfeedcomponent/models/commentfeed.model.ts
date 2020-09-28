export interface ICommentFeedCreateForm {
  id: string;
  description: string;
  feedId: string;
  createdAt: string;
  createdBy: string;
  userId: string;
}

export interface ICommentFeedUpdateForm {
  id: string;
  description: string;
  updatedAt: string;
  isUpdated: boolean;
}
