import express from "express";
import { CommentPostController } from "../controllers/commentpost.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import {
  CommentPostCreateSchema,
  CommentPostUpdateSchema,
} from "../DTO/commentpost.dto";

export class CommentPostRoute {
  public commentPostController: CommentPostController = new CommentPostController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group/:group_id/topic/topic_id/post/:post_id/comment")
      .get(commonCheckAuth, this.commentPostController.getAllCommentPost)
      .post(
        commonCheckAuth,
        commonValidateBody(CommentPostCreateSchema),
        this.commentPostController.getAllCommentPost
      );

    app
      .route(
        "/v1/api/group/:group_id/topic/topic_id/post/:post_id/comment/:comment_id"
      )
      .get(commonCheckAuth, this.commentPostController.getCommentPost)
      .patch(
        commonCheckAuth,
        commonValidateBody(CommentPostUpdateSchema),
        this.commentPostController.updateCommentPost
      )
      .delete(commonCheckAuth, this.commentPostController.deleteCommentPost);
  }
}
