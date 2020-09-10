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
        return res.json({ error: "Email has been existed" });
      }

      const result = await User.find({ display_name: form.display_name });
      if (result.length !== 0) {
        return res.json({ error: "Display_name has been existed" });
      }

      form.password = await bcrypt.hash(req.body.password, 10);

      const user = await this.userService.create(form);
      // return res.json(serializeCreateUser(user));
      return res.json({ message: "You have registered account successfully" });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const form: IUserLoginForm = req.body;
      const user = await User.find({
        email: form.email,
        status: StatusCode.Active,
      });
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
      return res.json({ error: "Email hasn't been existed" });
    } catch (error) {
      res.json({ error: error });
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

        return res.json({
          accessToken,
          refreshTokenFromClient,
        });
      } catch (error) {
        return res.status(403).send({
          error: "Invalid refresh token",
        });
      }
    }

    return res.status(403).send({
      error: "No token provided",
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
            error: "Newpassword has different from oldpassword",
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
          return res.json({
            message: "You have updated account unsuccessfully",
          });
          //return res.json(serializeUpdateUser(result));
        }
        return res.json({ error: "Re-password invalid" });
      }
      return res.json({ error: "Oldpassword user unsuccessfully" });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;

        const check: any = await User.findById(user_id);
        if (check.role === RoleCode.Admin) {
          return res.json({ error: "You can not delete admin" });
        }

        if (check.status === StatusCode.Deactive) {
          return res.json({ error: "User has been deleted" });
        }

        await User.findByIdAndUpdate(user_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        return res.json({ message: "You have deleted user successfully" });
      }

      return res.json({ error: "You cannot delete user, you aren't admin" });
    } catch (error) {
      return res.json({ error: error });
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
      return res.json({ error: "You cannot get user, you aren't admin" });
    } catch (error) {
      return res.json({ error: error });
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
      return res.json({ error: error });
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
      return res.json({ error: "You cannot get all user, you aren't admin" });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  changeRoleUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      const { newRole } = req.body; // ???
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;
        const user: any = await User.findById(user_id);
        if (newRole === user.role) {
          return res.json({ error: "Newrole has been diffirent from oldrole" });
        }
        if (newRole == RoleCode.Admin) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              role: RoleCode.Admin,
            },
          });
          return res.json({
            message: "You have changed user's role - admin successfully",
          });
        } else if (newRole === RoleCode.Moderator) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              role: RoleCode.Moderator,
            },
          });
          return res.json({
            message: "You have changed user's role - moderator successfully",
          });
        }

        await User.findByIdAndUpdate(user_id, {
          $set: {
            role: RoleCode.Member,
          },
        });
        return res.json({
          message: "You have changed user's role - member successfully",
        });
      }

      return res.json({
        error: "You cannot change role user, you aren't admin",
      });
    } catch (error) {
      return res.json({ error: "123" });
    }
  };

  getRecover = async (req: Request, res: Response) => {
    try {
      //
    } catch (error) {
      return res.json({ error: error });
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
