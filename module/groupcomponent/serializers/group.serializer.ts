import { IGroupCreateForm, IGroupUpdateForm } from "../models/group.model";
export interface IGroupCreateResponse {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export function serialCreateGroup(
  model: IGroupCreateForm
): IGroupCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    name: model.name,
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface IGroupUpdateResponse {
  id: string;
  name: string;
  updatedAt: string;
  updatedBy: string;
}

export function serialUpdateGroup(
  model: IGroupUpdateForm
): IGroupUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    name: model.name,
    updatedAt: model.updatedAt,
    updatedBy: model.updatedBy,
  };
}
