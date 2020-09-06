import { ITopicCreateForm, ITopicUpdateForm } from "../models/topic.model";

export interface ITopicCreateResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // createdBy: object;
}

export function serializeCreateTopic(
  model: ITopicCreateForm
): ITopicCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    name: model.name,
    description: model.description,
    createdAt: model.createdAt,
    // createdBy: model.createdBy,
  };
}

export interface ITopicUpdateResponse {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  // updatedBy: object;
}

export function serializeUpdateTopic(
  model: ITopicUpdateForm
): ITopicUpdateResponse {
  if (!model) {
  }

  return {
    name: model.name,
    id: model.id,
    description: model.description,
    updatedAt: model.updatedAt,
    // updatedBy: model.updatedBy
  };
}
