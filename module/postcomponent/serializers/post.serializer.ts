import { IPostCreateForm, IPostUpdateForm } from "../models/post.model";

export interface IPostCreateResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  // createdBy: object
}

export function serializeCreatePost(
  model: IPostCreateForm
): IPostCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    createdAt: model.createdAt,
  };
}

export interface IPostUpdateResponse {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  // updatedBy: string
}

export function serializeUpdatePost(
  model: IPostUpdateForm
): IPostUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    updatedAt: model.updatedAt,
  };
}
