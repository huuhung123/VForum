import {
  ICommentPostCreateForm,
  ICommentPostUpdateForm,
} from "../models/commentpost.model";

export interface ICommentPostCreateResponse {
  id: string;
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
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface ICommentPostUpdateResponse {
  id: string;
  updatedAt: string;

  isUpdated: boolean;
}

export function serialUpdateCommentPost(
  model: ICommentPostUpdateForm
): ICommentPostUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
    
    isUpdated: model.isUpdated
  };
}
