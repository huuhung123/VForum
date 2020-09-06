import { IUserCreateForm, IUserUpdateForm } from "../models/user.model";
export interface IUserCreateResponse {
  id: string;
  createdAt: string;
  // createdBy: object
}

export function serializeCreateUser(
  model: IUserCreateForm
): IUserCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    createdAt: model.createdAt,
    // createdBy: model.createdBy
  };
}

export interface IUserUpdateResponse {
  id: string;
  updatedAt: string;
  // updatedBy: object
}

export function serializeUpdateUser(
  model: IUserUpdateForm
): IUserUpdateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    updatedAt: model.updatedAt,
    // updatedBy: object
  };
}
