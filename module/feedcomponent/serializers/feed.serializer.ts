import { IFeedCreateForm } from "../models/feed.model";

export interface IFeedCreateResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  accountId: string;
}

export function serializeFeed(model: IFeedCreateForm): IFeedCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    createdAt: model.createdAt,
    accountId: model.accountId,
  };
}
