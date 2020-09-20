import mongoose, { Schema } from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const CommentPostSchemaName = "CommentPost";
export interface ICommentPost extends IModelBase {
  postId: string;
  description: string;
  countLike: number;
}

const CommentPostSchema = new Schema(
  SchemaBase({
    postId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    countLike: {
      type: Number,
      default: 0,
    },
  }),
  {
    timestamps: true,
  }
);

export const CommentPost = mongoose.model<ICommentPost>(
  CommentPostSchemaName,
  CommentPostSchema
);
