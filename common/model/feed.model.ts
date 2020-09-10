import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types, Schema } from "mongoose";

export const FeedSchemaName = "Feed";

export interface IFeed extends IModelBase {
  title: string;
  description: string;
  tagging: Types.Array<object>;
  attachments: Types.Array<object>;
  commentsFeed: Types.Array<object>; // 2
  userId: string;
  countLike: number;
  countCommentFeed: number;
}

const FeedSchema = new Schema(
  SchemaBase({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tagging: {
      type: Object,
    },
    attachments: [
      {
        type: Object,
      },
    ],
    commentsFeed: [
      {
        type: Object,
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
  }),
  {
    timestamps: true,
  }
);

export const Feed = mongoose.model<IFeed>(FeedSchemaName, FeedSchema);
