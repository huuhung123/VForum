import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Schema } from "mongoose";

export const CommentFeedSchemaName = "CommentFeed";

export interface ICommentFeed extends IModelBase {
  feedId: string;
  accountId: string;
  description: string;
}

const CommentFeedSchema = new Schema(
  SchemaBase({
    feedId: {
      type: Schema.Types.ObjectId,
      default: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      default: true,
    },
    description: {
      type: String,
      default: true,
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
