import {
  ICommentFeedCreateForm,
  ICommentFeedUpdateForm,
} from "../models/commentfeed.model";

export interface ICommentFeedCreateResponse {
  id: string;
  createdAt: string;
  createdBy: string;
}

export function serializeCommentFeed(
  model: ICommentFeedCreateForm
): ICommentFeedCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface ICommentFeedUpdateResponse {
  id: string;
  updatedAt: string;
  isUpdated: boolean;
}

export function serialUpdateCommentFeed(
  model: ICommentFeedUpdateForm
): ICommentFeedUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
    isUpdated: model.isUpdated,
  };
}
