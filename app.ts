import * as dotenv from "dotenv";
import express from "express";
import 'reflect-metadata';
import { createConnection } from "typeorm";
import config from "./config/general";
import { WalletRoute } from "./module/Wallet/routes/wallet.route";

createConnection()
.then(async () => {
  const app = express()
  dotenv.config();
  config(app)
  const routes = new WalletRoute()
  routes.routes(app)
  app.listen(app.get("port"), () => console.log('Server up at http://localhost:4000'))
})
.catch((error) => console.log(error))

