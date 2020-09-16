import express from "express";
import { PostController } from "../controllers/post.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { isAuth } from "../../../middlewares/auth.middleware";

import { PostCreateSchema, PostUpdateSchema } from "../DTO/post.dto";
export class PostRoute {
  public postController: PostController = new PostController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group/:group_id/topic/:topic_id/post")
      .get(isAuth, this.postController.getAllPost)
      .post(
        isAuth,
        commonValidateBody(PostCreateSchema),
        this.postController.createPost
      );

    app
      .route("/v1/api/group/:group_id/topic/:topic_id/post/:post_id")
      .get(isAuth, this.postController.getPost)
      .patch(
        isAuth,
        commonValidateBody(PostUpdateSchema),
        this.postController.updatePost
      )
      .delete(isAuth, this.postController.deletePost);

    app
      .route("/v1/api/group/:group_id/topic/:topic_id/post/:post_id/likes")
      .patch(isAuth, this.postController.updateLike);
  }
}
