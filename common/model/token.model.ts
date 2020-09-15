import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Document } from "mongoose";
export const TokenSchemaName = "Token";

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expire_access: string;
  expire_refresh: string;
  createdAt: Date;
  updatedAt: Date;
  // device_push_token: string;
  // device_identifier: string;
}

const TokenSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expire_access: {
      type: String,
      required: true,
      default: "1h",
    },
    expire_refresh: {
      type: String,
      required: true,
      default: "2h",
    },

    // device_push_token: {
    //   type: String,
    //  required: true
    // },
    // device_identifier: {
    //   type: String,
    //  required: true
    // }
  },
  {
    timestamps: true,
  }
);

export const Token = mongoose.model<IToken>(TokenSchemaName, TokenSchema);
