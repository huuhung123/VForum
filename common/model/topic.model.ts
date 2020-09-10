import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types, Schema } from "mongoose";

export const TopicSchemaName = "Topic";

export interface ITopic extends IModelBase {
  name: string;
  description: string;
  groupId: string;
}

const TopicSchema = new Schema(
  SchemaBase({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  }),
  {
    timestamps: true,
  }
);

export const Topic = mongoose.model<ITopic>(TopicSchemaName, TopicSchema);
