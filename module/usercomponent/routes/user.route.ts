import express from "express";
import { UserController } from "../controllers/user.controller";

// import { commonValidateBody } from "../../../middlewares/validatebody.middleware";

import { UserCreateSchema, UserLoginSchema } from "../DTO/user.dto";

export class UserRoute {
  public userController: UserController = new UserController();

  public routes(app: express.Application): void {
    app
      .route("/vi/api/signup")
 //   .post(commonValidateBody(UserCreateSchema),this.userController.createUser)
      .post(this.userController.createUser);
    app
      .route("/vi/api/login") 
 //     .post(commonValidateBody(UserLoginSchema), this.userController.loginUser)
      .post(this.userController.loginUser)
  }
}
