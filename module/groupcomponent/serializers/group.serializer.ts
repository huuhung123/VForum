import { IGroupCreateForm, IGroupUpdateForm } from "../models/group.model";
export interface IGroupCreateResponse {
  id: string;
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
    createdAt: model.createdAt,
    createdBy: model.createdBy,
  };
}

export interface IGroupUpdateResponse {
  id: string;
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
    updatedAt: model.updatedAt,
    updatedBy: model.updatedBy,
  };
}
