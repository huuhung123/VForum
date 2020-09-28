import mongoose, { Schema } from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const CommentFeedSchemaName = "CommentFeed";
export interface ICommentFeed extends IModelBase {
  feedId: string;
  description: string;
  countLike: number;
  userId: string;
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
    userId: {
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

export const CommentFeed = mongoose.model<ICommentFeed>(
  CommentFeedSchemaName,
  CommentFeedSchema
);
