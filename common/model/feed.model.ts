import mongoose, { Types, Schema } from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const FeedSchemaName = "Feed";
export interface IFeed extends IModelBase {
  description: string;
  tagging: Types.Array<object>;
  userId: string;
  attachments: Types.Array<string>;
  commentsFeed: Types.Array<object>;
  countLike: number;
  countCommentFeed: number;
  flags: Types.Array<string>;
}

const FeedSchema = new Schema(
  SchemaBase({
    description: {
      type: String,
      required: true,
    },
    tagging: {
      type: Object,
      required: true,
      default: true,
    },
    attachments: [
      {
        type: String,
        default: true,
        required: true,
      },
    ],
    commentsFeed: [
      {
        type: Object,
        default: true,
        required: true,
      },
    ],
    userId: {
      type: String,
      required: true,
    },
    countLike: {
      type: Number,
      required: true,
      default: 0,
    },
    countCommentFeed: {
      type: Number,
      required: true,
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

export const Feed = mongoose.model<IFeed>(FeedSchemaName, FeedSchema);
