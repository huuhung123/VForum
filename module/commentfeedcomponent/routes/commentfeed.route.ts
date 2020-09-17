import express from "express";
import { CommentFeedController } from "../controllers/commentfeed.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";

import { isAuth } from "../../../middlewares/auth.middleware";

import {
  CommentFeedCreateSchema,
  CommentFeedUpdateSchema,
} from "../DTO/commentfeed.dto";

export class CommentFeedRoute {
  public commentFeedController: CommentFeedController = new CommentFeedController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/feed/:feed_id/comment")
      .get(isAuth, this.commentFeedController.getAllCommentFeed)
      .post(
        isAuth,
        commonValidateBody(CommentFeedCreateSchema),
        this.commentFeedController.createCommentFeed
      );

    app
      .route("/v1/api/feed/:feed_id/comment/:comment_id")
      .get(isAuth, this.commentFeedController.getCommentFeed)
      .patch(
        isAuth,
        commonValidateBody(CommentFeedUpdateSchema),
        this.commentFeedController.updateCommentFeed
      )
      .delete(isAuth, this.commentFeedController.deleteCommentFeed);

    app
      .route("/v1/api/feed/:feed_id/comment/:comment_id/addlike")
      .patch(isAuth, this.commentFeedController.addLike);

    app
      .route("/v1/api/feed/:feed_id/comment/:comment_id/minuslike")
      .patch(isAuth, this.commentFeedController.minusLike);
  }
}
