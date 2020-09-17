export interface IFeedCreateForm {
  description: string;
  attachments: any;
  id: string;
  userId: string;
  createdAt: string;
  createdBy: string;
}
export interface IFeedUpdateForm {
  description: string;
  attachments: any;
  id: string;
  updatedAt: string;
  isUpdated: boolean;
}
