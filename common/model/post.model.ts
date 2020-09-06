import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types, Schema } from "mongoose";

export const PostSchemaName = "Post";

export interface IPost extends IModelBase {
  title: string;
  description: string;
  commentsPost: Types.Array<object>;
  likesPost: Types.Array<object>;
}

const PostSchema = new Schema(
  SchemaBase({
    title: {
      type: String,
      default: true,
    },
    description: {
      type: String,
      default: true,
    },
    commentsPost: [
      {
        type: Object,
        default: true,
      },
    ],
    likesPost: [
      {
        type: Object,
        default: true,
      },
    ],
  }),
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>(PostSchemaName, PostSchema);
