import express from "express";
import { GroupController } from "../controllers/group.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { isAuth } from "../../../middlewares/auth.middleware";

import { GroupCreateSchema, GroupUpdateSchema } from "../DTO/group.dto";

export class GroupRoute {
  public groupController: GroupController = new GroupController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group")
      .get(isAuth, this.groupController.getAllGroup)
      .post(
        isAuth,
        commonValidateBody(GroupCreateSchema),
        this.groupController.createGroup
      );

    app
      .route("/v1/api/group/:group_id")
      .get(isAuth, this.groupController.getGroup)
      .patch(
        isAuth,
        commonValidateBody(GroupUpdateSchema),
        this.groupController.updateGroup
      )
      .delete(isAuth, this.groupController.deleteGroup);
  }
}
