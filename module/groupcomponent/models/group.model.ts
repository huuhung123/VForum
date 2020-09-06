import { Types, Schema } from "mongoose";
import { IUser } from "../../../common/model/common.model";

export interface IGroupCreateForm {
  id: string;
  name: string;
  createdAt: string;
  // createdBy: object;
}

export interface IGroupUpdateForm {
  id: string;
  name: string;
  updatedAt: string;
  // updatedBy: object;
}
