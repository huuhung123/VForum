import { ITopicCreateForm, ITopicUpdateForm } from "../models/topic.model";

export interface ITopicCreateResponse {
  id: string;
  groupId: string
  createdAt: string;
  createdBy: string;
}

export function serializeCreateTopic(
  model: ITopicCreateForm
): ITopicCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    groupId: model.groupId,
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface ITopicUpdateResponse {
  id: string;
  updatedAt: string;
}

export function serializeUpdateTopic(
  model: ITopicUpdateForm
): ITopicUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
  };
}
