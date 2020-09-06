import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Schema } from "mongoose";

export const LikePostSchemaName = "LikePost";

export interface ILikePost extends IModelBase {
  postId: string;
  accountId: string;
}

const LikePostSchema = new Schema(
  SchemaBase({
    postId: {
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

export const LikePost = mongoose.model<ILikePost>(
  LikePostSchemaName,
  LikePostSchema
);
