import {
  ICommentPostCreateForm,
  ICommentPostUpdateForm,
} from "../models/commentpost.model";

export interface ICommentPostCreateResponse {
  id: string;
  description: string;
  postId: string;
  createdAt: string;
  // createdBy: object;
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
    // updatedBy: model.updatedBy
  };
}

export interface ICommentPostUpdateResponse {
  id: string;
  description: string;
  postId: string;
  updatedAt: string;
  // updatedBy: object;
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
    // updatedBy: model.updatedBy
  };
}
