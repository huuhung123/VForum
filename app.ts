import * as dotenv from "dotenv";
import express from "express";
import { mongoSetup } from "./config/connection";
import config from "./config/general";
import { WalletRoute } from "./module/User/WalletComponent/routes/wallet.route";

class Server {
  public app: express.Application;

  // public MongoStore = connectMongo(session);
  public walletRoute: WalletRoute = new WalletRoute()
  public MONGO_URL = "mongodb+srv://trantronghieu:a-z01667668966@cluster0.n9sao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


  constructor() {
    this.app = express();
    dotenv.config();
    config(this.app)
    mongoSetup(this.MONGO_URL)
    this.walletRoute.routes(this.app)

  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
