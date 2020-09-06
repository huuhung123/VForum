import express, { Router } from "express";
import mongoose from "mongoose";

import { UserRoute } from "./module/usercomponent/routes/user.route";
import { TopicRoute } from "./module/topiccomponent/routes/topic.route";
import { GroupRoute } from "./module/groupcomponent/routes/group.route";
import { PostRoute } from "./module/postcomponent/routes/post.route";

import { FeedRoute } from "./module/feedcomponent/routes/feed.route";
import { CommentFeedRoute } from "./module/commentfeedcomponent/routes/commentfeed.route";

import session from "express-session";
// import { SSession } from "./middlewares/session.middleware";

class Server {
  public app: express.Application;
  public mongoUrl: string = "mongodb://localhost:27017/VForum";

  public userRoute: UserRoute = new UserRoute();
  public topicRoute: TopicRoute = new TopicRoute();
  public groupRoute: GroupRoute = new GroupRoute();
  public postRoute: PostRoute = new PostRoute();
  public feedRoute: FeedRoute = new FeedRoute();
  public commentFeedRoute: CommentFeedRoute = new CommentFeedRoute();

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();
    this.middlewares();

    // this.app.use('/v1/api', this.userRoute.routes(this.app))

    this.userRoute.routes(this.app);
    this.topicRoute.routes(this.app);
    this.groupRoute.routes(this.app);
    this.postRoute.routes(this.app);
    this.feedRoute.routes(this.app);
    this.commentFeedRoute.routes(this.app);
  }

  private config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private middlewares(): void {
    this.app.use(
      session({
        name: "Hung",
        secret: "NguyenHuuHung",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 2 * 60 * 60,
          sameSite: true,
          secure: false,
        },
      })
    );
  }

  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
