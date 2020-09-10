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

import { User, RoleCode } from "../../../common/model/user.model";
import { StatusCode } from "../../../common/model/common.model";
import { Group } from "../../../common/model/group.model";
import { Topic } from "../../../common/model/topic.model";
import { Post } from "../../../common/model/post.model";
import { CommentPost } from "../../../common/model/commentpost.model";

import { Token } from "../../../common/model/token.model";
import {
  generateToken,
  verifyToken,
} from "../../../middlewares/helper.middleware";

export class UserController {
  public userService: UserService = new UserService(User);

  createUser = async (req: Request, res: Response) => {
    try {
      const form: IUserCreateForm = req.body;
      const mailExist = await this.userService.findByEmail(form);

      if (mailExist.length === 1) {
        return res.json({ Error: "Email existed" });
      }

      const result = await User.find({ display_name: form.display_name });
      if (result.length !== 0) {
        return res.json({ Error: "Please, you enter display_name again" });
      }

      form.password = await bcrypt.hash(req.body.password, 10);

      const user = await this.userService.create(form);
      // return res.json(serializeCreateUser(user));
      return res.json({ Message: "Register successfully" });
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
        if (check) {
          const accessTokenLife = "1h";
          // process.env.ACCESS_TOKEN_LIFE
          const accessTokenSecret = "secret";
          // process.env.ACCESS_TOKEN_SECRET
          const refreshTokenLife = "3650d";
          // process.env.REFRESH_TOKEN_LIFE
          const refreshTokenSecret = "secret";
          // process.env.REFRESH_TOKEN_SECRET

          const accessToken = await generateToken(
            user[0],
            accessTokenSecret,
            accessTokenLife
          );

          const refreshToken = await generateToken(
            user[0],
            refreshTokenSecret,
            refreshTokenLife
          );

          const newToken = new Token({
            accessToken,
            refreshToken,
          });
          await newToken.save();

          return res.status(200).json({
            accessToken,
            refreshToken,
          });
        }
        return res.json({ error: "Password error" });
      }
      return res.json({ Error: "User not found, email doesn't exist" });
    } catch (error) {
      res.json({ Error: error });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshTokenFromClient = req.body.refreshToken;
    const refreshTokenSecret = "secret";
    const accessTokenSecret = "secret";
    const accessTokenLife = "1h";

    const checkToken = await Token.find({
      refreshToken: refreshTokenFromClient,
    });
    if (refreshTokenFromClient && checkToken.length > 0) {
      try {
        const decoded = await verifyToken(
          refreshTokenFromClient,
          refreshTokenSecret
        );

        const accessToken = await generateToken(
          decoded,
          accessTokenSecret,
          accessTokenLife
        );
      } catch (error) {
        return res.status(403).send({
          message: "Invalid refresh token",
        });
      }
    }

    return res.status(403).send({
      message: "No token provided",
    });
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { oldpassword, newpassword, renewpassword } = req.body;
      const form: IUserUpdateForm = req.body;

      const { _id } = req.authorized_user;

      const user: any = await User.findById(_id);
      const check = await bcrypt.compare(oldpassword, user.password);

      if (check) {
        if (oldpassword === newpassword) {
          return res.json({
            error: "newpassword has different from oldpassword",
          });
        }
        if (newpassword === renewpassword) {
          await User.findByIdAndUpdate(
            _id,
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

          const result: any = await User.findById(_id);
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
      const { role } = req.authorized_user;
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;

        const check: any = await User.findById(user_id);
        if (check.role === RoleCode.Admin) {
          return res.json({ Error: "You can not delete admin" });
        }

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

  getUserById = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;
        const result = await User.findById(
          user_id,
          "_id _email display_name gender role status"
        );
        return res.json({ data: result });
      }
      return res.json({ Error: "You cannot get user" });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      const result = await User.findById(
        _id,
        "_id email display_name gender role"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  getAllUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      if (role === RoleCode.Admin) {
        const result = await User.find(
          {},
          "_id email display_name gender role status"
        );
        return res.json({ data: result });
      }
      return res.json({ Error: "You cannot get user" });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  changeRoleUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      const { status } = req.params; // ???
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;
        if (status == RoleCode.Admin) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              status: RoleCode.Admin,
            },
          });
          return res.json({ Message: "Change role user successfully" });
        } else if (status === RoleCode.Moderator) {
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

  getRecover = async (req: Request, res: Response) => {
    try {
      //
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  patchRecover = async (req: Request, res: Response) => {
    const { group_id, topic_id, post_id, comment_id } = req.params;
    if (group_id !== undefined) {
      Group.findByIdAndUpdate(
        group_id,
        {
          $set: {
            status: StatusCode.Active,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    if (topic_id !== undefined) {
      Topic.findByIdAndUpdate(
        topic_id,
        {
          $set: {
            status: StatusCode.Active,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    if (post_id !== undefined) {
      Post.findByIdAndUpdate(
        post_id,
        {
          $set: {
            status: StatusCode.Active,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    if (comment_id !== undefined) {
      CommentPost.findByIdAndUpdate(
        comment_id,
        {
          $set: {
            status: StatusCode.Active,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
  };
}
