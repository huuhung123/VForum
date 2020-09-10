import mongoose, {
  Document,
  SchemaDefinition,
  SchemaTypes,
  Schema,
  Types,
} from "mongoose";

export const UserSchemaName = "User";
export const GroupSchemaName = "Group";
export const TopicSchemaName = "Topic";
export const PostSchemaName = "Post";
export const CommentPostSchemaName = "CommentPost";
export const LikePostSchemaName = "LikePost";
export const FeedSchemaName = "Feed";
export const CommentFeedSchemaName = "CommentFeed";
export const LikeFeedSchemaName = "LikeFeed";

export enum StatusCode {
  Active = "active",
  Deactive = "deactive",
}
export interface IModelBase extends Document {
  _id: string;
  status: string;
  createdBy: string;
  updatedBy?: string;
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
    },

    updatedBy: {
      type: String,
    },
  };

  return {
    ...schema,
    ...defaultSchema,
  };
}
