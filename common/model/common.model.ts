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

// export enum GenderCode {
//   Male = "male",
//   Female = "female",
//   Lgbt = "lgbt",
// }

// export enum RoleCode {
//   Member = "member",
//   Moderator = "moderator",
//   Admin = "admin",
// }

export interface IModelBase extends Document {
  _id: string;
  status: string;
  createdBy?: string;
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
      // type: Schema.Types.ObjectId,
      // ref: UserSchemaName,
      type: String,
    },

    updatedBy: {
      // type: Schema.Types.ObjectId,
      // ref: UserSchemaName,
      type: String,
    },
  };

  return {
    ...schema,
    ...defaultSchema,
  };
}
