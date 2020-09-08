import express from "express";
import { UserController } from "../controllers/user.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import {
  UserCreateSchema,
  UserLoginSchema,
  UserChangeSchema,
} from "../DTO/user.dto";

export class UserRoute {
  public userController: UserController = new UserController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/signup")
      .post(
        commonValidateBody(UserCreateSchema),
        this.userController.createUser
      );
    app
      .route("/v1/api/login")
      .post(commonValidateBody(UserLoginSchema), this.userController.loginUser);

    app
      .route("/v1/api/home")
      .patch(
        commonCheckAuth,
        commonValidateBody(UserChangeSchema),
        this.userController.updateUser
      );

    app
      .route("/v1/api/admin")
      .get(commonCheckAuth, this.userController.getUser);

    app
      .route("/v1/api/admin/:user_id")
      .patch(commonCheckAuth, this.userController.changeRoleUser)
      .delete(commonCheckAuth, this.userController.deleteUser);

    // Recover
    app
      .route("/v1/api/admin/recover")
      .get(commonCheckAuth, this.userController.getRecover);

    app
      .route("/v1/api/admin/recover/:group_id?:topic_id?:post_id?:comment_id?")
      .patch(commonCheckAuth, this.userController.patchRecover);
  }
}
