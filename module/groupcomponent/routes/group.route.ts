import express from "express";
import { GroupController } from "../controllers/group.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import { GroupCreateSchema, GroupUpdateSchema } from "../DTO/group.dto";

export class GroupRoute {
  public groupController: GroupController = new GroupController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/group")
      //.get(commonCheckAuth, this.groupController.getAllGroup)
      .get(this.groupController.getAllGroup)
      //.post(commonCheckAuth ,commonValidateBody(GroupCreateSchema), this.groupController.createGroup)
      .post(
        commonValidateBody(GroupCreateSchema),
        this.groupController.createGroup
      );

    app
      .route("/v1/api/group/:group_id")
      // .get(commonCheckAuth, this.groupController.getGroup)
      .get(this.groupController.getGroup)
      // .patch(commonCheckAuth, commonValidateBody(GroupUpdateSchema), this.groupController.updateGroup)
      .patch(
        commonValidateBody(GroupUpdateSchema),
        this.groupController.updateGroup
      )
      // .delete(commonCheckAuth, this.groupController.deleteGroup)
      .delete(this.groupController.deleteGroup);
  }
}
