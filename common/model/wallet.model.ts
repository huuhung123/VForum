import mongoose, { Schema, Types } from "mongoose";

import { IModelBase, SchemaBase } from "./common.model";

export const WalletSchemaName = "Wallet";

export interface IWallet extends IModelBase {
  walletId: string;
  amount: number;
  userId: string;
  type: string;
}

const WalletSchema = new Schema(
  SchemaBase({
    walletId: {
      type: String,
    },
    userId: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
  }),
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model<IWallet>(
  WalletSchemaName,
  WalletSchema
);
