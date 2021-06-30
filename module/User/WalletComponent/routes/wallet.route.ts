import express from "express";
import { commonValidateBody } from "../../../../middlewares/validatebody.middleware";
import { WalletController } from "../controllers/wallet.controller";
import { WalletCreateSchema, WalletUpdateSchema } from "../DTO/wallet.dto";

export class WalletRoute {
  public walletControler: WalletController = new WalletController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/wallet")
      .get(this.walletControler.getAllWallet)
      .post(
        commonValidateBody(WalletCreateSchema),
        this.walletControler.createWallet
      );

    app
      .route("/v1/api/wallet/:wallet_id")
      .get(this.walletControler.getWalletById)
      .patch(
        commonValidateBody(WalletUpdateSchema),
        this.walletControler.updateWallet
      )
      .delete(this.walletControler.deleteWallet);

  }

}
