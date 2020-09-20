import mongoose from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const GroupSchemaName = "Group";

export interface IGroup extends IModelBase {
  name: string;
}

const GroupSchema = new mongoose.Schema(
  SchemaBase({
    name: {
      type: String,
      default: true,
    },
  }),
  {
    timestamps: true,
  }
);

export const Group = mongoose.model<IGroup>(GroupSchemaName, GroupSchema);
