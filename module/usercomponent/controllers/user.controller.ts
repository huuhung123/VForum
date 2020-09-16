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

import {
  ACCESS_TOKEN_LIFE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
} from "../../../config/env";

import { success, error } from "../../../common/service/response.service";
import { decryptRegister } from "../../../middlewares/authRSA.middleware";
import {
  SendGridEmail,
  SendGridContent,
  SendGridService,
  SendGridMail,
} from "../../../common/service/email.service";

import * as sgMail from "@sendgrid/mail";

export class UserController {
  public userService: UserService = new UserService(User);

  createUser = async (req: Request, res: Response) => {
    try {
      const form: IUserCreateForm = req.body;
      const mailExist = await this.userService.findByEmail(form);
      if (mailExist.length === 1) {
        const messageError = "Email has been existed";
        return error(res, messageError);
      }

      // const mail = new SendGridMail(
      //   new SendGridEmail("from@example.com"),
      //   "Sending with SendGrid is Fun",
      //   new SendGridEmail("dupbolun2012@gmail.com"),
      //   new SendGridContent("text/plain", "Email sent to to@example.com")
      // );

      // const sendGridService: SendGridService = new SendGridService(
      //   "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"
      // );
      // sendGridService.send(mail);

      // form.display_name = decryptRegister(form.display_name);
      // form.email = decryptRegister(form.email);
      // form.gender = decryptRegister(form.gender);
      form.password = await bcrypt.hash(req.body.password, 10);

      const user = await this.userService.create(form);
      const messageSuccess = "User has been registed successfully";
      return success(res, serializeCreateUser(user), messageSuccess, 201);
    } catch (err) {
      return error(res, err);
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
          const accessTokenLife = ACCESS_TOKEN_LIFE;
          const accessTokenSecret = ACCESS_TOKEN_SECRET;
          const refreshTokenLife = REFRESH_TOKEN_LIFE;
          const refreshTokenSecret = REFRESH_TOKEN_SECRET;

          const accessToken = await generateToken(
            user[0],
            ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_LIFE
          );

          const refreshToken = await generateToken(
            user[0],
            REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_LIFE
          );

          const newToken = new Token({
            accessToken,
            refreshToken,
            userId: user[0]._id,
          });
          await newToken.save();

          const result = {
            accessToken,
            refreshToken,
            userId: user[0]._id,
          };

          const messageSuccess = "Token has been created successfully";
          return success(res, result, messageSuccess, 201);
        }
        const messageError = "Password error";
        return error(res, messageError);
      }
      const messageError = "Email hasn't been existed";
      return error(res, messageError);
    } catch (err) {
      return error(res, err);
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

        const accessToken: any = await generateToken(
          decoded,
          accessTokenSecret,
          accessTokenLife
        );

        await Token.updateOne(
          { refreshToken: refreshTokenFromClient },
          { $set: { accessToken: accessToken } }
        );

        const result = {
          accessToken,
          refreshTokenFromClient,
        };
        const messageSuccess = "Access-token has been updated successfully";
        return success(res, result, messageSuccess, 201);
      } catch (err) {
        const messageError = "Invalid refresh token";
        return error(res, messageError, 403);
      }
    }

    const messageError = "No token provided";
    return error(res, messageError, 403);
  };

  getLogout = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      await Token.remove({ userId: _id });
      const messageSuccess = "You have logouted successfully";
      return success(res, null, messageSuccess);
    } catch (err) {
      return error(res, err);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { oldpassword, newpassword, renewpassword } = req.body;
      const form: IUserUpdateForm = req.body;

      const { _id, role } = req.authorized_user;
      const user: any = await User.findById(_id);
      const check = await bcrypt.compare(oldpassword, user.password);

      if (check) {
        if (oldpassword === newpassword) {
          const messageError = "Newpassword has different from oldpassword";
          return error(res, messageError);
        }
        if (newpassword === renewpassword) {
          const user: any = await User.findByIdAndUpdate(
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
          const messageSuccess = "User have been updated successfully";
          return success(res, serializeUpdateUser(user), messageSuccess, 201);
        }
        const messageError = "Re-password invalid";
        return error(res, messageError);
      }
      const messageError = "Oldpassword user unsuccessfully";
      return error(res, messageError);
    } catch (err) {
      return error(res, err);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;

        const check: any = await User.findById(user_id);
        if (check.role === RoleCode.Admin) {
          const messageError = "You can not delete admin";
          return error(res, messageError);
        }

        if (check.status === StatusCode.Deactive) {
          const messageError = "User has been deleted";
          return error(res, messageError);
        }

        await User.findByIdAndUpdate(user_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        const messageSuccess = "You have deleted user successfully";
        return success(res, null, messageSuccess);
      }

      const messageError = "You cannot delete user, you aren't admin";
      return error(res, messageError, 403);
    } catch (err) {
      return error(res, err);
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
        const messageSuccess = "You have get user by ID successfully";
        return success(res, result, messageSuccess);
      }
      const messageError = "You cannot get user, you aren't admin";
      return error(res, messageError, 403);
    } catch (err) {
      return error(res, err);
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { _id, role } = req.authorized_user;
      const result = await User.findById(
        _id,
        "_id email display_name gender role"
      );
      const messageSuccess = "You have get user successfully";
      return success(res, result, messageSuccess);
    } catch (err) {
      return error(res, err);
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
        const messageSuccess = "You have get all user successfully";
        return success(res, result, messageSuccess);
      }
      const messageError = "You cannot get all user, you aren't admin";
      return error(res, messageError, 403);
    } catch (err) {
      return error(res, err);
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
          const messageError = "Newrole has been different from oldrole";
          return error(res, messageError);
        }
        if (newRole == RoleCode.Admin) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              role: RoleCode.Admin,
            },
          });
          const messageSuccess =
            "You have changed user's role - admin successfully";
          return success(res, null, messageSuccess);
        } else if (newRole === RoleCode.Moderator) {
          await User.findByIdAndUpdate(user_id, {
            $set: {
              role: RoleCode.Moderator,
            },
          });
          const messageSuccess =
            "You have changed user's role - moderator successfully";
          return success(res, null, messageSuccess);
        }

        await User.findByIdAndUpdate(user_id, {
          $set: {
            role: RoleCode.Member,
          },
        });
        const messageSuccess =
          "You have changed user's role - member successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot change role user, you aren't admin";
      return error(res, messageError, 403);
    } catch (error) {
      return res.json({ error });
    }
  };

  getRecover = async (req: Request, res: Response) => {
    try {
      //
    } catch (err) {
      return error(res, err);
    }
  };

  patchRecover = async (req: Request, res: Response) => {
    const { group_id, topic_id, post_id, comment_id } = req.params;
    if (group_id !== undefined) {
      await Group.findByIdAndUpdate(
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
      const messageSuccess = "You have recovered group successfully";
      return success(res, null, messageSuccess);
    }
    if (topic_id !== undefined) {
      await Topic.findByIdAndUpdate(
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
      const messageSuccess = "You have recovered topic successfully";
      return success(res, null, messageSuccess);
    }
    if (post_id !== undefined) {
      await Post.findByIdAndUpdate(
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
      const messageSuccess = "You have recovered post successfully";
      return success(res, null, messageSuccess);
    }
    if (comment_id !== undefined) {
      await CommentPost.findByIdAndUpdate(
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
      const messageSuccess = "You have recovered comment successfully";
      return success(res, null, messageSuccess);
    }
  };
}
