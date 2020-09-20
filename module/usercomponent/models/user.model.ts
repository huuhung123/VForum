import { RoleCode } from "../../../common/model/user.model";

export interface IUserCreateForm {
  id: string;
  email: string;
  password: string;
  display_name: string;
  gender: string;
  role: RoleCode;
  createdAt: string;
}

export interface IUserLoginForm {
  email: string;
  password: string;
}
export interface IUserUpdateForm {
  oldpassword: string;
  newpassword: string;
  renewpassword: string;
  isUpdated: boolean;
  updatedAt: string;
  id: string;
}
