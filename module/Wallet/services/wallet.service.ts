// import { Wallet } from "../../../../common/entity/wallet.entity";
import { Wallet } from "../../../common/entity/wallet.entity";
import { BaseAbstractRepository } from "../../../common/repositoriy/base.repository";

export class WalletRepository extends BaseAbstractRepository<Wallet> {

  constructor(public readonly walletRepository: any ) {
      super(walletRepository);
    }
};