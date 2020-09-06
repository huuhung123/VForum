import express from "express";
import { CommentFeedController } from "../controllers/commentfeed.controller";

// import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
// import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

// import { GroupCreateSchema } from "../DTO/group.dto";

export class CommentFeedRoute {
  public commentFeedController: CommentFeedController = new CommentFeedController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/:user_id/feed/:feed_id/comment")
      .get(this.commentFeedController.getAllCommentFeed)
      .post(this.commentFeedController.createCommentFeed);

    app
      .route("/v1/api/:user_id/feed/:feed_id/comment/:comment_id")
      .get(this.commentFeedController.getCommentFeed)
      .delete(this.commentFeedController.deleteCommentFeed);
  }
}
