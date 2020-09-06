import express from "express";
import { FeedController } from "../controllers/feed.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import { FeedCreateSchema, FeedUpdateSchema } from "../DTO/feed.dto";

export class FeedRoute {
  public feedController: FeedController = new FeedController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/feed")
      // .get(commonCheckAuth, this.feedController.getAllFeed)
      .get(this.feedController.getAllFeed)
      // .post(
      //   commonCheckAuth,
      //   commonValidateBody(FeedCreateSchema),
      //   this.feedController.createFeed
      // )
      .post(
        commonValidateBody(FeedCreateSchema),
        this.feedController.createFeed
      );

    app
      .route("/v1/api/feed/:feed_id")
      // .get(commonCheckAuth, this.feedController.getFeed)
      .get(this.feedController.getFeed)
      // .patch(
      //   commonCheckAuth,
      //   commonValidateBody(FeedUpdateSchema),
      //   this.feedController.updateFeed
      // )
      .patch(
        commonValidateBody(FeedUpdateSchema),
        this.feedController.updateFeed
      )
      // .delete(commonCheckAuth, this.feedController.deleteFeed)
      .delete(this.feedController.deleteFeed);
  }
}
