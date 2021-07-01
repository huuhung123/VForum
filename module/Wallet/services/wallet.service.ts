import { Repository } from "typeorm";
import { Wallet } from "../../../common/entity/wallet.entity";
import { BaseAbstractRepository } from "../../../common/repositoriy/base.repository";

export class WalletRepository extends BaseAbstractRepository<Wallet> {

  constructor(public readonly walletRepository: Repository<Wallet> ) {
      super(walletRepository);
    }
};