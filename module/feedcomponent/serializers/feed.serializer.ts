import { IFeedCreateForm, IFeedUpdateForm } from "../models/feed.model";

export interface IFeedCreateResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  // createdBy: string
}

export function serializeCreateFeed(
  model: IFeedCreateForm
): IFeedCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    createdAt: model.createdAt,
    // createdBy: string
  };
}

export interface IFeedUpdateResponse {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  // updatedBy: string
}

export function serializeUpdateFeed(
  model: IFeedUpdateForm
): IFeedUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    updatedAt: model.updatedAt,
    // updatedBy: string
  };
}
