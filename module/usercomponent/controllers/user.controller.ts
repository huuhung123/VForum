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
import { User } from "../../../common/model/common.model";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { json } from "body-parser";

export class UserController {
  public userService: UserService = new UserService(User);

  createUser = async (req: Request, res: Response) => {
    try {
      const form: IUserCreateForm = req.body;

      const mailExist = await this.userService.findByEmail(form);

      if (mailExist.length === 1) {
        return res.json({ Error: "Mail exists" });
      }

      form.password = await bcrypt.hash(req.body.password, 10);

      const user = await this.userService.create(form);
      return res.json(serializeCreateUser(user));
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const form: IUserLoginForm = req.body;

      const user = await this.userService.findByEmail(form); // array

      if (user.length === 1) {
        const check = await bcrypt.compare(form.password, user[0].password);
        console.log(check);
        if (check) {
          //   req!.session!.user = user[0]
          //  console.log(req!.session!.user)

          const token = jwt.sign(
            {
              userid: user[0]._id,
              email: user[0].email,
              role: user[0].role,
              status: user[0].status,
              display_name: user[0].display_name,
              gender: user[0].gender,
              createdAt: user[0].createdAt,
              updatedAt: user[0].updatedAt,
            },
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
        }
        return res.json({ error: "Password error" });
      }
      return res.json({ Error: "User not found, email doesn't exist" });
    } catch (error) {
      res.json({ Error: error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { oldpassword, newpassword, renewpassword } = req.body;

      const form: IUserUpdateForm = req.body;

      // const {_id, password } = req!.session!.user;

      const user: any = await User.findById("5f54a0dd94273a271497a1d7");
      const check = await bcrypt.compare(oldpassword, user.password);

      // const check = await bcrypt.compare(oldpassword, password)

      if (check) {
        if (newpassword == renewpassword) {
          await User.findByIdAndUpdate(
            // _id,
            "5f54a0dd94273a271497a1d7",
            {
              $set: {
                password: await bcrypt.hash(newpassword, 10),
              },
            },
            {
              new: true,
            }
          );

          // const result: any = awit User.findById(_id);
          const result: any = await User.findById("5f54a0dd94273a271497a1d7");

          return res.json(serializeUpdateUser(result));
        }
        return res.json({ Error: "Re-password invalid" });
      }
      return res.json({ Error: "Oldpassword user unsuccessfully" });
    } catch (error) {
      return res.json({ Error: "Updat unsuccessfully" });
    }
  };

  // deleteUser = async (req: Request, res: Response) => {
  //   try {
  //     const checkAdmin = req!.session!.user.role;
  //     if (checkAdmin) {

  //     }
  //     return res.json({Error: "You cannot deleted"})
  //     const deletedUser = await this.userService.findByIdAndDelete(req.params);
  //     if (deletedUser) {
  //       return res.json({ Message: "Deleted successfully" });
  //     }
  //     return res.json({ Error: "Id not found" });
  //   } catch (error) {
  //     return res.json({ Error: error });
  //   }
  // };
}
