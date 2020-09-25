import express from "express";
import mongoose from "mongoose";

import { UserRoute } from "./module/usercomponent/routes/user.route";
import { TopicRoute } from "./module/topiccomponent/routes/topic.route";
import { GroupRoute } from "./module/groupcomponent/routes/group.route";
import { PostRoute } from "./module/postcomponent/routes/post.route";
import { CommentPostRoute } from "./module/commentpostcomponent/routes/commentpost.route";
import { FeedRoute } from "./module/feedcomponent/routes/feed.route";
import { CommentFeedRoute } from "./module/commentfeedcomponent/routes/commentfeed.route";

import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectMongo from "connect-mongo";

import { MONGO_URL, SESS_NAME, SESS_PASS, SESS_MAXAGE } from "./config/env";
class Server {
  public app: express.Application;

  public MONGODB_URL = MONGO_URL;
  public MongoStore = connectMongo(session);

  public userRoute: UserRoute = new UserRoute();
  public topicRoute: TopicRoute = new TopicRoute();
  public groupRoute: GroupRoute = new GroupRoute();
  public postRoute: PostRoute = new PostRoute();
  public commentPostRoute: CommentPostRoute = new CommentPostRoute();
  public feedRoute: FeedRoute = new FeedRoute();
  public commentFeedRoute: CommentFeedRoute = new CommentFeedRoute();

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();
    dotenv.config();
    this.middlewares();

    this.userRoute.routes(this.app);
    this.topicRoute.routes(this.app);
    this.groupRoute.routes(this.app);
    this.postRoute.routes(this.app);
    this.commentPostRoute.routes(this.app);
    this.feedRoute.routes(this.app);
    this.commentFeedRoute.routes(this.app);
  }

  private config(): void {
    this.app.set("port", process.env.PORT);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }

  private middlewares(): void {
    // const sessionStore = new this.MongoStore({
    //   mongooseConnection: mongoose.createConnection(this.MONGODB_URL, {
    //     useFindAndModify: false,
    //     useUnifiedTopology: true,
    //     useNewUrlParser: true,
    //   }),
    //   collection: "sessions",
    // });

    this.app.use(
      session({
        name: SESS_NAME,
        secret: SESS_PASS,
        resave: false,
        saveUninitialized: true,
        // store: sessionStore,
        cookie: {
          maxAge: SESS_MAXAGE,
          sameSite: true,
          secure: false,
        },
      })
    );
  }

  private mongoSetup(): void {
    // mongoose.connect(this.MONGODB_URL, {
    //   dbName: process.env.DB_NAME,
    //   user: process.env.DB_USER,
    //   pass: process.env.DB_PASS,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify: false,
    // });

    mongoose.connect(this.MONGODB_URL, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connect successfully");
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
