import mongoose, {
  Document,
  SchemaDefinition,
  SchemaTypes,
  Schema,
} from "mongoose";

export enum StatusCode {
  Active = "active",
  Suspended = "suspended",
  Deleted = "deleted",
}

export enum GenderCode {
  Male = "male",
  Female = "female",
  Lgbt = "lgbt",
}

export enum RoleCode {
  Member = "member",
  Moderator = "moderator",
  Admin = "admin",
}

export interface IModelBase extends Document {
  _id: String;
  status: StatusCode;
  createdAt: String;
  updatedAt?: Date;
}

export function SchemaBase(schema: SchemaDefinition) {
  const defaultSchema: SchemaDefinition = {
    status: {
      type: String,
      required: true,
      default: StatusCode.Active,
    },
  };

  return {
    ...schema,
    ...defaultSchema,
  };
}

export const DefaultPassword = "123456789";
export const UserSchemaName = "User";

export interface IUser extends IModelBase {
  email: string;
  password: string;
  display_name: string;
  gender: GenderCode;
  role: RoleCode;
}

export interface IGroup {
  company_id: string;
  name: string;
  topics: [
    {
      type: Schema.Types.ObjectId;
      ref: "ITopic";
    }
  ];
}

export interface IPost {
  title: string;
  description: string;
  account_id: {
    type: Schema.Types.ObjectId;
    ref: "IUser";
  };
  comments_post: [
    {
      type: Schema.Types.ObjectId;
      ref: "ICommmentPost";
    }
  ];
  likes_post: [
    {
      type: Schema.Types.ObjectId;
      ref: "ILikePost";
    }
  ];
}

export interface ICommmentPost {
  post_id: Schema.Types.ObjectId;
  account_id: Schema.Types.ObjectId;
  description: string;
}

export interface ILikePost {
  post_id: Schema.Types.ObjectId;
  account_id: Schema.Types.ObjectId;
}

export interface IFeed {
  account_id: number;
  tagging: Array<number>;
  description: string;
  attachments: [
    {
      type: Schema.Types.ObjectId;
      ref: "IAttachment";
    }
  ];
  comments: [
    {
      type: Schema.Types.ObjectId;
      ref: "ICommentFeed";
    }
  ];
  likes: [
    {
      type: Schema.Types.ObjectId;
      ref: "ILikeFeed";
    }
  ];
}

export interface IAttachment {}

export interface ICommentFeed {
  feed_id: Schema.Types.ObjectId;
  account_id: Schema.Types.ObjectId;
  description: string;
}

export interface ILikeFeed {
  feed_id: Schema.Types.ObjectId;
  account_id: Schema.Types.ObjectId;
}

const UserSchema = new mongoose.Schema(
  SchemaBase({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default: DefaultPassword,
    },
    display_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      role: RoleCode.Member,
    },
    createdAt: {
      type: String,
    },
  })
);

export const User = mongoose.model<IUser>(UserSchemaName, UserSchema);
