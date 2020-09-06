import express from "express";
import { FeedController } from "../controllers/feed.controller";

// import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
// import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

// import { TopicCreateSchema } from "../DTO/topic.dto";

export class FeedRoute {
  public feedController: FeedController = new FeedController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/:user_id/feed")
      .get(this.feedController.getAllFeed)
      .post(this.feedController.createFeed);

    app
      .route("/v1/api/:user_id/feed/:feed_id")
      .get(this.feedController.getFeed)
      .delete(this.feedController.deleteFeed);
  }
}
