import mongoose, { Schema, Types } from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const CommentPostSchemaName = "CommentPost";
export interface ICommentPost extends IModelBase {
  postId: string;
  description: string;
  countLike: number;
  flags: Types.Array<string>;
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
    flags: [
      {
        type: String,
        required: true,
        default: true,
      },
    ],
  }),
  {
    timestamps: true,
  }
);

export const CommentPost = mongoose.model<ICommentPost>(
  CommentPostSchemaName,
  CommentPostSchema
);
