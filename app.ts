import express from "express";
import mongoose from "mongoose";
import * as bodyParser from "body-parser";

import { UserRoute } from "./module/usercomponent/routes/user.route";

class Server {
  public app: express.Application;
  public mongoUrl: string = "mongodb://localhost:27017/VForum";

  public userRoute: UserRoute = new UserRoute();

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();

    this.userRoute.routes(this.app);
  }

  private config(): void {
    this.app.set("port", process.env.PORT || 4000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
       console.log("Connect successfully")
    });
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));
    });
  }
}

const server = new Server();
server.start();
