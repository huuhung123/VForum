import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Schema } from "mongoose";

export const LikeFeedSchemaName = "LikeFeed";

export interface ILikeFeed extends IModelBase {
  feedId: string;
  accountId: string;
}

const LikeFeedSchema = new Schema(
  SchemaBase({
    feedId: {
      type: Schema.Types.ObjectId,
      default: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      default: true,
    },
  }),
  {
    timestamps: true,
  }
);

export const LikeFeed = mongoose.model<ILikeFeed>(
  LikeFeedSchemaName,
  LikeFeedSchema
);
