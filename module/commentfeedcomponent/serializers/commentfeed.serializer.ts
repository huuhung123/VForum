import { ICommentFeedCreateForm } from "../models/commentfeed.model";

export interface ICommentFeedCreateResponse {
  id: string;
  description: string;
  createdAt: string;
  accountId: string;
}

export function serializeCommentFeed(model: ICommentFeedCreateForm): ICommentFeedCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    description: model.description,
    createdAt: model.createdAt,
    accountId: model.accountId,
  };
}
