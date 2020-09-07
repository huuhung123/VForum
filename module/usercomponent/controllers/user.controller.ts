import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  IUserCreateForm,
  IUserLoginForm,
  IUserUpdateForm,
} from "../models/user.model";
import {
  serializeCreateUser,
  serializeUpdateUser,
} from "../serializers/user.serializer";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User, RoleCode } from "../../../common/model/user.model";
import { StatusCode } from "../../../common/model/common.model";

export class UserController {
  public userService: UserService = new UserService(User);

  createUser = async (req: Request, res: Response) => {
    try {
      const form: IUserCreateForm = req.body;
      const mailExist = await this.userService.findByEmail(form);

      if (mailExist.length === 1) {
        return res.json({ Error: "Email existed" });
        // return res.json({ data: false });
      }

      form.password = await bcrypt.hash(req.body.password, 10);

      const user = await this.userService.create(form);
      return res.json(serializeCreateUser(user));
      // return res.json({ data: true });
    } catch (error) {
      // return res.json({ data: false });
      return res.json({ Error: error });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const form: IUserLoginForm = req.body;
      const user = await this.userService.findByEmail(form); // array

      if (user.length === 1) {
        const check = await bcrypt.compare(form.password, user[0].password);
        if (check) {
          // req!.session!.userId = user[0]._id;
          const token = jwt.sign(
            {
              userId: user[0]._id,
              email: user[0].email,
              role: user[0].role,
            },
            // process.env.JWT_KEY,
            "secret",
            {
              expiresIn: "1h",
            }
          );
          return res.json({
            message: "Successfully",
            id: user[0]._id,
            token: token,
          });
          // return res.json({
          //   data: 1,
          // });
        }
        return res.json({ error: "Password error" });
        // return res.json({ data: 2 });
      }
      return res.json({ Error: "User not found, email doesn't exist" });
      // return res.json({ data: 3 });
    } catch (error) {
      res.json({ Error: error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { oldpassword, newpassword, renewpassword } = req.body;
      const form: IUserUpdateForm = req.body;

      const { userId, password } = res.locals.user;

      const user: any = await User.findById(userId);
      const check = await bcrypt.compare(oldpassword, user.password);

      if (check) {
        if (newpassword == renewpassword) {
          await User.findByIdAndUpdate(
            userId,
            {
              $set: {
                password: await bcrypt.hash(newpassword, 10),
              },
            },
            {
              new: true,
              useFindAndModify: false,
            }
          );

          const result: any = await User.findById(userId);
          return res.json(serializeUpdateUser(result));
        }
        return res.json({ Error: "Re-password invalid" });
      }
      return res.json({ Error: "Oldpassword user unsuccessfully" });
    } catch (error) {
      return res.json({ Error: "Update unsuccessfully" });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { role } = res.locals.user;
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;
        await User.findByIdAndUpdate(user_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        return res.json({ Message: "Deleted user successfully" });
      }

      return res.json({ Error: "You cannot delete user" });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { role } = res.locals.user;
      if (role === RoleCode.Admin) {
        const result = await User.find({}, '_id email display_name gender role status');
        return res.json({ data: result });
      }
      return res.json({ Error: "You cannot get user" });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  changeRoleUser = async (req: Request, res: Response) => {
    try {
      const { role } = res.locals.user;
      const { status } = req.params; //
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;
        if (status == RoleCode.Admin) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              status: RoleCode.Admin,
            },
          });
          return res.json({ Message: "Change role user successfully" });
        } else if (role === RoleCode.Moderator) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              status: RoleCode.Moderator,
            },
          });
          return res.json({ Message: "Change role user successfully" });
        }

        await User.findByIdAndUpdate(user_id, {
          $set: {
            status: RoleCode.Member,
          },
        });
        return res.json({ Message: "Change role user successfully" });
      }

      return res.json({ Error: "You cannot change role user" });
    } catch (error) {
      return res.json({ Error: error });
    }
  };
}
