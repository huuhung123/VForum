import { IFeedCreateForm, IFeedUpdateForm } from "../models/feed.model";

export interface IFeedCreateResponse {
  id: string;
  userId: string;
  createdAt: string;
  createdBy: string;
}

export function serializeCreateFeed(
  model: IFeedCreateForm
): IFeedCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    userId: model.userId,
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface IFeedUpdateResponse {
  id: string;
  updatedAt: string;
  isUpdated: boolean;
}

export function serializeUpdateFeed(
  model: IFeedUpdateForm
): IFeedUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
    isUpdated: model.isUpdated,
  };
}
