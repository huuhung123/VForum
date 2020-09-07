import express from "express";
import { TopicController } from "../controllers/topic.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import { TopicCreateSchema, TopicUpdateSchema } from "../DTO/topic.dto";

export class TopicRoute {
  public topicController: TopicController = new TopicController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group/:group_id/topic")
      .get(commonCheckAuth, this.topicController.getAllTopic)
      .post(
        commonCheckAuth,
        commonValidateBody(TopicCreateSchema),
        this.topicController.createTopic
      );

    app
      .route("/v1/api/group/:group_id/topic/:topic_id")
      .get(commonCheckAuth, this.topicController.getTopic)
      .patch(
        commonCheckAuth,
        commonValidateBody(TopicUpdateSchema),
        this.topicController.updateTopic
      )
      .delete(commonCheckAuth, this.topicController.deleteTopic);
  }
}
