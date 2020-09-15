import express from "express";
import { CommentPostController } from "../controllers/commentpost.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { isAuth } from "../../../middlewares/auth.middleware";

import {
  CommentPostCreateSchema,
  CommentPostUpdateSchema,
} from "../DTO/commentpost.dto";

export class CommentPostRoute {
  public commentPostController: CommentPostController = new CommentPostController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group/:group_id/topic/:topic_id/post/:post_id/comment")
      .get(isAuth, this.commentPostController.getAllCommentPost)
      .post(
        isAuth,
        commonValidateBody(CommentPostCreateSchema),
        this.commentPostController.createCommentPost
      );

    app
      .route(
        "/v1/api/group/:group_id/topic/:topic_id/post/:post_id/comment/:comment_id"
      )
      .get(isAuth, this.commentPostController.getCommentPost)
      .patch(
        isAuth,
        commonValidateBody(CommentPostUpdateSchema),
        this.commentPostController.updateCommentPost
      )
      .delete(isAuth, this.commentPostController.deleteCommentPost);
  }
}
