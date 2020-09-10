import express from "express";
import { UserController } from "../controllers/user.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { isAuth } from "../../../middlewares/auth.middleware";

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

    app.route("/v1/api/refresh-token").post(this.userController.refreshToken); /// ???

    app
      .route("/v1/api/info")
      .get(isAuth, this.userController.getUser)
      .patch(
        isAuth,
        commonValidateBody(UserChangeSchema),
        this.userController.updateUser
      );

    app
      .route("/v1/api/admin/info")
      .get(isAuth, this.userController.getAllUser)
      .patch(
        isAuth,
        commonValidateBody(UserChangeSchema),
        this.userController.updateUser
      );

    app
      .route("/v1/api/admin-info")
      .get(isAuth, this.userController.getUser)
      .patch(
        isAuth,
        commonValidateBody(UserChangeSchema),
        this.userController.updateUser
      );

    app
      .route("/v1/api/admin/info/:user_id")
      .get(isAuth, this.userController.getUserById)
      .patch(isAuth, this.userController.changeRoleUser)
      .delete(isAuth, this.userController.deleteUser);

    app
      .route("/v1/api/admin/recover")
      .get(isAuth, this.userController.getRecover);

    app
      .route("/v1/api/admin/recover/:group_id?:topic_id?:post_id?:comment_id?")
      .patch(isAuth, this.userController.patchRecover);
  }
}
