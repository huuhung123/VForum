import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types, Schema } from "mongoose";

export const FeedSchemaName = "Feed";

export interface IFeed extends IModelBase {
  description: string;
  tagging: Types.Array<object>;
  userId: string;
  attachments: Types.Array<object>;
  commentsFeed: Types.Array<object>; // 2
  countLike: number;
  countCommentFeed: number;
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
        type: Object,
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
  }),
  {
    timestamps: true,
  }
);

export const Feed = mongoose.model<IFeed>(FeedSchemaName, FeedSchema);
