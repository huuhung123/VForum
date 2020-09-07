import {
  ICommentPostCreateForm,
  ICommentPostUpdateForm,
} from "../models/commentpost.model";

export interface ICommentPostCreateResponse {
  id: string;
  description: string;
  postId: string;
  createdAt: string;
  createdBy: string;
}

export function serialCreateCommentPost(
  model: ICommentPostCreateForm
): ICommentPostCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    description: model.description,
    postId: model.postId,
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface ICommentPostUpdateResponse {
  id: string;
  description: string;
  postId: string;
  updatedAt: string;
  updatedBy: string;
}

export function serialUpdateCommentPost(
  model: ICommentPostUpdateForm
): ICommentPostUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    description: model.description,
    postId: model.postId,
    updatedAt: model.updatedAt,
    updatedBy: model.updatedBy,
  };
}
