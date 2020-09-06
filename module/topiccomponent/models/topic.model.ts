import { Types } from "mongoose";

export interface ITopicCreateForm {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // createdBy: object
}

export interface ITopicUpdateForm {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  //updatedBy: object
}
