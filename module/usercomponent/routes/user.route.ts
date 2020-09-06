import express from "express";
import { UserController } from "../controllers/user.controller";

import { commonValidateBody } from "../../../middlewares/validatebody.middleware";
import { commonCheckAuth } from "../../../middlewares/checkauth.middleware";

import { UserCreateSchema, UserLoginSchema, UserChangeSchema } from "../DTO/user.dto";

export class UserRoute {
  public userController: UserController = new UserController();

  public routes(app: express.Application): void {
    app
      .route("/v1/api/signup")
      .post(commonValidateBody(UserCreateSchema),this.userController.createUser)
//5f549adf37005322c4a43134
    app
      .route("/v1/api/login")
      .post(commonValidateBody(UserLoginSchema), this.userController.loginUser)

    app
      .route("/v1/api/home")
      // .patch(commonCheckAuth, commonValidateBody(UserChangeSchema), this.userController.changeUser)
      .patch(commonValidateBody(UserChangeSchema), this.userController.updateUser)
    //  .delete(commonCheckAuth ,this.userController.deleteUser);
  }
}














