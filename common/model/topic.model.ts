import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types, Schema } from "mongoose";

export const TopicSchemaName = "Topic";

export interface ITopic extends IModelBase {
  name: string;
  description: string;
  posts: Types.Array<object>;
}

const TopicSchema = new Schema(
  SchemaBase({
    name: {
      type: String,
      default: true,
    },
    description: {
      type: String,
      default: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: true,
      },
    ],
  }),
  {
    timestamps: true,
  }
);

export const Topic = mongoose.model<ITopic>(TopicSchemaName, TopicSchema);
