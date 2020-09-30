import mongoose, { Schema, Types } from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const CommentFeedSchemaName = "CommentFeed";
export interface ICommentFeed extends IModelBase {
  feedId: string;
  description: string;
  countLike: number;
  flags: Types.Array<string>;
  userId: string;
  avatar: string;
}

const CommentFeedSchema = new Schema(
  SchemaBase({
    feedId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "",
    },
    countLike: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
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

export const CommentFeed = mongoose.model<ICommentFeed>(
  CommentFeedSchemaName,
  CommentFeedSchema
);
