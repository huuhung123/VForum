import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types } from "mongoose";
import { UserSchema } from "./user.model";

export const GroupSchemaName = "Group";

export interface IGroup extends IModelBase {
  name: string;
  topics: Types.Array<object>;
}

const GroupSchema = new mongoose.Schema(
  SchemaBase({
    name: {
      type: String,
      default: true,
    },
    topics: [
      {
        type: Object,
        default: true,
      },
    ],
    createdBy: {
      type: UserSchema,
      default: true,
    },
    updatedBy: {
      type: UserSchema,
      default: true,
    },
  }),
  {
    timestamps: true,
  }
);

export const Group = mongoose.model<IGroup>(GroupSchemaName, GroupSchema);
