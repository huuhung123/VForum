import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Schema } from "mongoose";

export const CommentPostSchemaName = "CommentPost";

export interface ICommentPost extends IModelBase {
  postId: string;
  description: string;
}

const CommentPostSchema = new Schema(
  SchemaBase({
    postId: {
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

export const CommentPost = mongoose.model<ICommentPost>(
  CommentPostSchemaName,
  CommentPostSchema
);
