import express from "express";
import { FeedController } from "../controllers/feed.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";

import { FeedCreateSchema, FeedUpdateSchema } from "../DTO/feed.dto";

import { isAuth } from "../../../middlewares/auth.middleware";

export class FeedRoute {
  public feedController: FeedController = new FeedController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/feed")
      .get(isAuth, this.feedController.getAllFeed)
      .post(
        isAuth,
        commonValidateBody(FeedCreateSchema),
        this.feedController.createFeed
      );

    app
      .route("/v1/api/feed/:feed_id")
      .get(isAuth, this.feedController.getFeed)
      .patch(
        isAuth,
        commonValidateBody(FeedUpdateSchema),
        this.feedController.updateFeed
      )
      .delete(isAuth, this.feedController.deleteFeed);
  }
}
