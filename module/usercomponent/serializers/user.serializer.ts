import { IUserCreateForm } from "../models/user.model"


export interface IUserCreateResponse  {
  id: String,
  createdAt: String,
}



export function serializeUser(model: IUserCreateForm ): IUserCreateResponse {
  if (!model) {
  }

  return {
    id: model.id,
    createdAt: model.createdAt
  };
}


