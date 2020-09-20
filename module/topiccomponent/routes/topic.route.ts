import express from "express";

import { TopicController } from "../controllers/topic.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { isAuth } from "../../../middlewares/auth.middleware";

import { TopicCreateSchema, TopicUpdateSchema } from "../DTO/topic.dto";

export class TopicRoute {
  public topicController: TopicController = new TopicController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group/:group_id/topic")
      .get(isAuth, this.topicController.getAllTopic)
      .post(
        isAuth,
        commonValidateBody(TopicCreateSchema),
        this.topicController.createTopic
      );

    app
      .route("/v1/api/group/:group_id/topic/:topic_id")
      .get(isAuth, this.topicController.getTopic)
      .patch(
        isAuth,
        commonValidateBody(TopicUpdateSchema),
        this.topicController.updateTopic
      )
      .delete(isAuth, this.topicController.deleteTopic);
  }
}
