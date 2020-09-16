import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Schema } from "mongoose";

export const LikeSchemaName = "Like";

export enum LikeType {
  Post = "Post",
  CommentPost = "CommentPost",
  Feed = "Feed",
  CommentFeed = "CommentFeed",
}

export enum LikeReferenceId {
  PostId = "PostId",
  CommentPostId = "CommentPostId",
  FeedId = "FeedId",
  CommentFeedId = "CommentFeedId",
}

export interface ILike extends IModelBase {
  likeType: string;
  likeReferenceId: string;
}

const LikeSchema = new Schema(
  SchemaBase({
    likeType: {
      type: String,
      enum: [
        LikeType.Post,
        LikeType.CommentPost,
        LikeType.Feed,
        LikeType.CommentFeed,
      ],
      required: true,
    },
    likeReferenceId: {
      type: String,
      enum: [
        LikeReferenceId.PostId,
        LikeReferenceId.CommentPostId,
        LikeReferenceId.FeedId,
        LikeReferenceId.CommentFeedId,
      ],
      required: true,
    },
  }),
  {
    timestamps: true,
  }
);

export const Like = mongoose.model<ILike>(LikeSchemaName, LikeSchema);
