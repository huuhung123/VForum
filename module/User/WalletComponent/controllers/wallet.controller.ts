import { Request, Response } from "express";
import { Wallet } from "../../../../common/model/wallet.model";
import { error, success } from "../../../../common/service/response.service";
import { StatusCode } from "../../../../utils/constants";
import { IWalletCreateForm, IWalletUpdateForm } from "../models/wallet.model";
import {
  serializeCreateWallet,
  serializeUpdateWallet
} from "../serializers/wallet.serializer";
import { WalletService } from "../services/wallet.service";


export class WalletController {
  public walletService: WalletService = new WalletService(Wallet);

  getAllWallet = async (req: Request, res: Response) => {
    try {
      const result = await Wallet.find(
        { status: StatusCode.Active },
        "walletId userId type amount"
      )
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  getWallet = async (req: Request, res: Response) => {
    try {
      const { wallet_id } = req.params;
      const result = await Wallet.find(
        {
          _id: wallet_id,
          status: StatusCode.Active,
        },
        "walletId userId type amount"
      );
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  createWallet = async (req: Request, res: Response) => {
    try {
      const formWallet: IWalletCreateForm = req.body;
      const check = await Wallet.find({
        type: formWallet.type,
        status: StatusCode.Active,
      });
      if (check.length > 0) {
        const messageError =
          "Wallet type has been existed. Please enter type again";
        return error(res, messageError, 200);
      }
      const wallet = await this.walletService.create(formWallet);
      const messageSuccess = "You have been created feed successfully";
      return success(res, serializeCreateWallet(wallet), messageSuccess);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  updateWallet = async (req: Request, res: Response) => {
    try {
      const { wallet_id } = req.params;

      const check: any = await Wallet.find({
        _id: wallet_id,
        status: StatusCode.Deactive,
      });

      if (check.length > 0) {
        const messageError = "Wallet has been deleted. You can not update Wallet";
        return error(res, messageError, 200);
      }

      const formWallet: IWalletUpdateForm = req.body;

      const newWallet: any = await Wallet.findByIdAndUpdate(
        wallet_id,
        {
          $set: {
            type: formWallet.type,
            amount: formWallet.amount
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      const messageSuccess = "Feed have updated successfully";
      return success(res, serializeUpdateWallet(newWallet), messageSuccess);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  deleteWallet = async (req: Request, res: Response) => {
    try {
      const { wallet_id } = req.params;

      const check: any = await Wallet.find({
        _id: wallet_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "Wallet has been deleted. You can not delete";
        return error(res, messageError, 200);
      }
        await Wallet.findByIdAndUpdate(wallet_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        const messageSuccess = "You deleted wallet successfully";
        return success(res, null, messageSuccess);
      }
    catch (err) {
      return error(res, err, 200);
    }
  };
}
