import { Types } from "mongoose";

export interface ITopicCreateForm {
  id: string;
  name: string;
  description: string;
  groupId: string;
  createdAt: string;
  createdBy: string;
}

export interface ITopicUpdateForm {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
}

