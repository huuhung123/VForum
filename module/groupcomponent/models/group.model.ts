export interface IGroupCreateForm {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export interface IGroupUpdateForm {
  id: string;
  name: string;
  updatedAt: string;
  // updatedBy: string;
  isUpdated: boolean;
}
