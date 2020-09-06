import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Types, Schema } from "mongoose";

export const FeedSchemaName = "Feed";

export interface IFeed extends IModelBase {
  title: string;
  description: string;
  tagging: Types.Array<object>;
  attachments: Types.Array<object>;
  commentsFeed: Types.Array<object>;
  likesFeed: Types.Array<object>;
}

const FeedSchema = new Schema(
  SchemaBase({
    title: {
      type: String,
      default: true,
    },
    description: {
      type: String,
      default: true,
    },
    tagging: {
      type: Object,
    },
    attachments: [
      {
        type: Object,
      },
    ],
    comments: [
      {
        type: Object,
      },
    ],
    likes: [
      {
        type: Object,
      },
    ],
  }),
  {
    timestamps: true,
  }
);

export const Feed = mongoose.model<IFeed>(FeedSchemaName, FeedSchema);
