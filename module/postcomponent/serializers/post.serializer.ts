import { IPostCreateForm, IPostUpdateForm } from "../models/post.model";

export interface IPostCreateResponse {
  id: string;
  createdAt: string;
  userId: string;
}

export function serializeCreatePost(
  model: IPostCreateForm
): IPostCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    createdAt: model.createdAt,
    userId: model.userId,
  };
}

export interface IPostUpdateResponse {
  id: string;
  updatedAt: string;
  isUpdated: boolean;
}

export function serializeUpdatePost(
  model: IPostUpdateForm
): IPostUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
    isUpdated: model.isUpdated,
  };
}
