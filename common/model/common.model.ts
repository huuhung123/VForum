import mongoose, { Document, SchemaDefinition } from "mongoose";
import { StatusCode  } from '../../utils/constants'

export const UserSchemaName = "User";
export const GroupSchemaName = "Group";
export const TopicSchemaName = "Topic";
export const PostSchemaName = "Post";
export const CommentPostSchemaName = "CommentPost";
export const LikePostSchemaName = "LikePost";
export const FeedSchemaName = "Feed";
export const CommentFeedSchemaName = "CommentFeed";
export const LikeFeedSchemaName = "LikeFeed";


export interface IModelBase extends Document {
  _id: string;
  status: string;
  createdBy: string;
  // isUpdated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function SchemaBase(schema: mongoose.SchemaDefinition) {
  const defaultSchema: SchemaDefinition = {
    status: {
      type: String,
      enum: [StatusCode.Active, StatusCode.Deactive],
      default: StatusCode.Active,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
      default: true,
    },
  };

  return {
    ...schema,
    ...defaultSchema,
  };
}
