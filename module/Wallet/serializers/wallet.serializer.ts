import { IWalletCreateForm, IWalletUpdateForm } from "../models/wallet.model";

export interface IWalletCreateResponse {
  type: string;
  amount: number;
}

export function serializeCreateWallet(
  model: IWalletCreateForm
): IWalletCreateResponse {
  if (!model) {
  }
  return {
    amount: model.amount,
    type: model.type,
  };
}

export interface IWalletUpdateResponse {
  type: string;
  amount: number;
}

export function serializeUpdateWallet(
  model: IWalletUpdateForm
): IWalletUpdateResponse {
  if (!model) {
  }
  return {
    amount: model.amount,
    type: model.type,
  };
}
