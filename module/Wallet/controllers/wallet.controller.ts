import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Wallet } from "../../../common/entity/wallet.entity";
import { errorHandler, successHandler } from "../../../common/service/response.service";
import { IWalletCreateForm, IWalletUpdateForm } from "../models/wallet.model";
import { WalletRepository } from "../services/wallet.service";


export class WalletController {
  public walletService: WalletRepository = new WalletRepository(getManager().getRepository(Wallet))

  getAllWallet = async (req: Request, res: Response) => {
    try {
      const {data, error}: any = await this.walletService.getAll();
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
      const {error, data} : any = await this.walletService.create(formWallet)
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

      const {data, error}: any = await this.walletService.updateById(wallet_id, formWallet);
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

      const {data, error} = await this.walletService.deleteById(wallet_id);
      console.log("Data", data)
      if (data) {
        successHandler(res, data, "Delete successfully", 202)
      }
      errorHandler(req, res, error , 404)
      } catch (err) {
      errorHandler(req, res ,err, 500);
    }
  }
}
