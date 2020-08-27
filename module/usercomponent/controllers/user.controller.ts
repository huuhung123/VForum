import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { IUserCreateForm, IUserLoginForm } from "../models/user.model";
import { serializeUser } from "../serializers/user.serializer";
import { User } from "../../../common/model/common.model";
import bcrypt from "bcrypt";

export class UserController {
  public userService: UserService = new UserService(User);

  loginUser = async (req: Request, res: Response) => {
    try {
      const form: IUserLoginForm = req.body;
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const form: IUserCreateForm = req.body;

      form.email = req.body.email;
      form.createdAt = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      form.password = await bcrypt.hash(String(req.body.password), 10);

      const user = await this.userService.create(form);
      return res.json(serializeUser(user));
    } catch (error) {
      return res.json({ Error: error });
    }
  };
}
