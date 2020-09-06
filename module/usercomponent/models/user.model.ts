import { RoleCode } from "../../../common/model/common.model";
import { string } from "joi";

export interface IUserCreateForm {
  id: string;
  email: string;
  password: string;
  display_name: string;
  gender: string;
  role: RoleCode;
  createdAt: string;
  // createdBy: string;
}

export interface IUserLoginForm {
  email: string;
  password: string;
}
export interface IUserUpdateForm {
  oldpassword: string;
  newpassword: string;
  renewpassword: string;
  // updatedBy: object;
  updatedAt: string;
  id: string;
}
