import { error } from "console";
import { Request, Response } from "express";
import { Wallet } from "../../../../common/model/wallet.model";
import { errorHandler, successHandler } from "../../../../common/service/response.service";
import { IWalletCreateForm, IWalletUpdateForm } from "../models/wallet.model";
import { WalletService } from "../services/wallet.service";


export class WalletController {
  public walletService: WalletService = new WalletService(Wallet);

  getAllWallet = async (req: Request, res: Response) => {
    try {
      const filter = {}
      const {data, error} = await this.walletService.getAll(filter);
      if (data) {
        successHandler(res, data, "Get all data successfully", 200)
      }
      errorHandler(req, res, error, 404)
      } catch (err) {
      errorHandler(req, res, err, 404)
    }
  };

  getWalletById = async (req: Request, res: Response) => {
    try {
      const { wallet_id } = req.params;
      const {data, error} = await this.walletService.getById(wallet_id);
      if (data) {
        successHandler(res, data, "Get data successfully", 200)
      }
      errorHandler(req, res, error, 404)
      } catch (err) {
      errorHandler(req, res, err, 404)
    }
  };

  createWallet = async (req: Request, res: Response) => {
    try {
      const formWallet: IWalletCreateForm = req.body;
      const filter = { amount: formWallet.amount}

      const { data, error } = await this.walletService.create(formWallet, filter); 
      if (data) {
        successHandler(res, data, "Create successfully", 201)
      }
      errorHandler(req, res, error, 404)
    } catch (err) {
      errorHandler(req, res, err, 404)
    }
  };

  updateWallet = async (req: Request, res: Response) => {
    try {
      const { wallet_id } = req.params;
      const formWallet: IWalletUpdateForm = req.body;
      const filter = {}

      const {data, error} = await this.walletService.update(wallet_id, formWallet, filter);
      if (data) {
        successHandler(res, data, "Update successfully", 202)
      }
      errorHandler(req, res, error, 404)
      } catch (err) {
      errorHandler(req, res ,err, 500);
    }
  }

  deleteWallet = async (req: Request, res: Response) => {
    try {
      const { wallet_id } = req.params;

      const {result, error} = await this.walletService.deleteById(wallet_id);
      if (result) {
        successHandler(res, "", "Delete successfully", 202)
      }
      errorHandler(req, res, error, 404)
      } catch (err) {
      errorHandler(req, res ,err, 500);
    }
  }
}
