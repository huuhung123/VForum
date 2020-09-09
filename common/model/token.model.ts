import { IModelBase, SchemaBase } from "./common.model";
import mongoose, { Document } from "mongoose";
export const TokenSchemaName = "Token";

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      default: true,
    },
    refreshToken: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Token = mongoose.model<IToken>(TokenSchemaName, TokenSchema);
