import {createWallet} from "./create-wallet"
import {deleteWallet} from "./delete-wallet"
import {getWallets} from "./get-wallets"
import {getWallet} from "./get-wallet"
import { updateWallet } from "./update-wallet"


export const wallet = {
    paths:{
        '/wallet':{
            ...createWallet,
            ...getWallets
        },
        '/wallet/{id}':{
            ...deleteWallet,
            ...getWallet,
            ...updateWallet,
        },
    }
}