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
      type: Schema.Types.ObjectId,
      ref: UserSchemaName,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: UserSchemaName,
    },
  };

  return {
    ...schema,
    ...defaultSchema,
  };
}

// export interface IUser extends IModelBase {
//   email: string;
//   password: string;
//   display_name: string;
//   gender: string;
//   role: string;
//   groups: Types.Array<object>;
//   feeds: Types.Array<object>;
// }

// export const UserSchema = new mongoose.Schema(
//   SchemaBase({
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//       match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     display_name: {
//       type: String,
//       required: true,
//     },
//     gender: {
//       type: String,
//       enum: [GenderCode.Female, GenderCode.Male, GenderCode.Lgbt],
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: [RoleCode.Admin, RoleCode.Member, RoleCode.Moderator],
//       default: RoleCode.Member,
//       required: true,
//     },
//     feeds: [
//       {
//         type: Object,
//         default: true,
//       },
//     ],
//     groups: [
//       {
//         type: Object,
//         default: true,
//       },
//     ],
//     // createdAt: {
//     //   type: String,
//     //   default: true,
//     // },
//     // updatedAt: {
//     //   type: String,
//     //   default: true,
//     // },
//   }),
//   {
//     timestamps: true,
//   }
// );
// export interface IGroup extends IModelBase {
//   name: string;
//   topics: Types.Array<object>;
// }

// const GroupSchema = new Schema(
//   SchemaBase({
//     name: {
//       type: String,
//       default: true,
//     },
//     topics: [
//       {
//         type: Object,
//         default: true,
//       },
//     ],
//     createdBy: {
//       type: UserSchema,
//       default: true,
//     },
//     updatedBy: {
//       type: UserSchema,
//       default: true,
//     },
//   }),
//   {
//     timestamps: true,
//   }
// );

// export interface ITopic extends IModelBase {
//   name: string;
//   description: string;
//   posts: Types.Array<object>;
// }

// const TopicSchema = new Schema(
//   SchemaBase({
//     name: {
//       type: String,
//       default: true,
//     },
//     description: {
//       type: String,
//       default: true,
//     },
//     posts: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Post",
//         default: true,
//       },
//     ],
//   }),
//   {
//     timestamps: true,
//   }
// );

// export interface IPost extends IModelBase {
//   title: string;
//   description: string;
//   commentsPost: Types.Array<object>;
//   likesPost: Types.Array<object>;
// }

// const PostSchema = new Schema(
//   SchemaBase({
//     title: {
//       type: String,
//       default: true,
//     },
//     description: {
//       type: String,
//       default: true,
//     },
//     commentsPost: [
//       {
//         type: Object,
//         //  ref: "CommentPost",
//         default: true,
//       },
//     ],
//     likesPost: [
//       {
//         type: Object,
//         // ref: "LikePost",
//         default: true,
//       },
//     ],
//   }),
//   {
//     timestamps: true,
//   }
// );

// export interface ICommentPost extends IModelBase {
//   postId: string;
//   description: string;
// }

// const CommentPostSchema = new Schema(
//   SchemaBase({
//     postId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//     description: {
//       type: String,
//       default: true,
//     },
//   }),
//   {
//     timestamps: true,
//   }
// );

// export interface ILikePost extends IModelBase {
//   postId: string;
//   accountId: string;
// }

// const LikePostSchema = new Schema(
//   SchemaBase({
//     postId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//     accountId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//   }),
//   {
//     timestamps: true,
//   }
// );
// export interface IFeed extends IModelBase {
//   accountId: string;
//   description: string;
//   tagging: Types.Array<object>;
//   attachments: Types.Array<object>;
//   commentsFeed: Types.Array<object>;
//   likesFeed: Types.Array<object>;
// }

// const FeedSchema = new Schema(
//   SchemaBase({
//     accountId: {
//       type: String,
//       default: true,
//     },
//     description: {
//       type: String,
//       default: true,
//     },
//     tagging: {
//       type: Object,
//       // default: true,
//     },
//     attachments: [
//       {
//         type: Object,
//         // ref: "Attachment",
//       },
//     ],
//     comments: [
//       {
//         type: Object,
//         // ref: "CommentFeed",
//       },
//     ],
//     likes: [
//       {
//         type: Object,
//         // ref: "LikeFeed",
//       },
//     ],
//   }),
//   {
//     timestamps: true,
//   }
// );

// export interface IAttachment {}

// export interface ICommentFeed extends IModelBase {
//   feedId: string;
//   accountId: string;
//   description: string;
// }

// const CommentFeedSchema = new Schema(
//   SchemaBase({
//     feedId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//     accountId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//     description: {
//       type: String,
//       default: true,
//     },
//   }),
//   {
//     timestamps: true,
//   }
// );

// export interface ILikeFeed extends IModelBase {
//   feedId: string;
//   accountId: string;
// }

// const LikeFeedSchema = new Schema(
//   SchemaBase({
//     feedId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//     accountId: {
//       type: Schema.Types.ObjectId,
//       default: true,
//     },
//   }),
//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.model<IUser>(UserSchemaName, UserSchema);
// export const Group = mongoose.model<IGroup>(GroupSchemaName, GroupSchema);
// export const Topic = mongoose.model<ITopic>(TopicSchemaName, TopicSchema);
// export const Post = mongoose.model<IPost>(PostSchemaName, PostSchema);
// export const CommentPost = mongoose.model<ICommentPost>(
//   CommentPostSchemaName,
//   CommentPostSchema
// );
// export const LikePost = mongoose.model<ILikePost>(
//   LikePostSchemaName,
//   LikePostSchema
// );
// export const Feed = mongoose.model<IFeed>(FeedSchemaName, FeedSchema);
// export const CommentFeed = mongoose.model<ICommentFeed>(
//   CommentFeedSchemaName,
//   CommentFeedSchema
// );
// export const LikeFeed = mongoose.model<ILikeFeed>(
//   LikeFeedSchemaName,
//   LikeFeedSchema
// );
