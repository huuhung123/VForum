import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Document } from "mongoose";
export const TokenSchemaName = "Token";

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  device_push_token: string;
  device_identifier: string;
  createdAt: Date;
  updatedAt: Date;
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
    // device_push_token: {
    //   type: String,
    //   required: true
    // },
    // device_identifier: {
    //   type: String,
    //   required: true
    // }
  },
  {
    timestamps: true,
  }
);

export const Token = mongoose.model<IToken>(TokenSchemaName, TokenSchema);
