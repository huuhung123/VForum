import express from "express";
import { PostController } from "../controllers/post.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import { PostCreateSchema, PostUpdateSchema } from "../DTO/post.dto";

export class PostRoute {
  public postController: PostController = new PostController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group/:group_id/topic/:topic_id/post")
      // .get(commonCheckAuth, this.postController.getAllPost)
      .get(this.postController.getAllPost)
      // .post(commonCheckAuth, commonValidateBody(PostCreateSchema), this.postController.createPost)
      .post(
        commonValidateBody(PostCreateSchema),
        this.postController.createPost
      );

    app
      .route("/v1/api/group/:group_id/topic/:topic_id/post/:post_id")
      // .get(commonCheckAuth, this.postController.getPost)
      .get(this.postController.getPost)
      // .patch(commonCheckAuth,commonValidateBody(PostUpdateSchema), this.postController.updatePost)
      // .patch(commonValidateBody(PostUpdateSchema), this.postController.updatePost)
      // .delete(commonCheckAuth, this.postController.deletePost)
      .delete(this.postController.deletePost);
  }
}
