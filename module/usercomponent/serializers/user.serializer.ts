import { IUserCreateForm, IUserUpdateForm } from "../models/user.model";
export interface IUserCreateResponse {
  id: string;
  createdAt: string;
  display_name: string;
}

export function serializeCreateUser(
  model: IUserCreateForm
): IUserCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    createdAt: model.createdAt,
    display_name: model.display_name,
  };
}

export interface IUserUpdateResponse {
  id: string;
  updatedAt: string;
}

export function serializeUpdateUser(
  model: IUserUpdateForm
): IUserUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
  };
}
