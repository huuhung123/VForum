import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { StatusCode } from "../../../common/model/common.model";
import { User, RoleCode } from "../../../common/model/user.model";
import { UserEmail } from "../../../common/model/user-email";

import { Token } from "../../../common/model/token.model";

import { UserService } from "../services/user.service";
import { success, error } from "../../../common/service/response.service";
import {
  ACCESS_TOKEN_LIFE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
} from "../../../config/env";

import {
  generateToken,
  verifyToken,
} from "../../../middlewares/helper.middleware";

import {
  IUserCreateForm,
  IUserLoginForm,
  IUserEmailLoginForm,
} from "../models/user.model";
import {
  serializeCreateUser,
  serializeUpdateUser,
} from "../serializers/user.serializer";

export class UserController {
  public userService: UserService = new UserService(User);

  createUser = async (req: Request, res: Response) => {
    try {
      const form: IUserCreateForm = req.body;
      const mailExist = await this.userService.findByEmail(form);
      if (mailExist.length === 1) {
        const messageError = "Email has been existed";
        return error(res, messageError, 200);
      }

      form.password = await bcrypt.hash(req.body.password, 10);

      const user = await this.userService.create(form);
      const messageSuccess = "User has been registed successfully";
      return success(res, serializeCreateUser(user), messageSuccess, 201);
    } catch (err) {
      return error(res, "Error", 200);
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
            role: user[0].role,
          };

          const messageSuccess = "Token has been created successfully";
          return success(res, result, messageSuccess, 201);
        }
        const messageError = "Password error";
        return error(res, messageError, 200);
      }
      const messageError = "Email hasn't been existed";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  loginUserByEmail = async (req: Request, res: Response) => {
    try {
      const form: IUserEmailLoginForm = req.body;
      const accessToken = await generateToken(
        req.body,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_LIFE
      );

      const refreshToken = await generateToken(
        req.body,
        REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_LIFE
      );

      const newUser = new UserEmail(req.body);
      newUser.save();

      const user = await UserEmail.find({
        email: form.email,
      });

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
        role: user[0].role,
      };

      const messageSuccess = "Token has been created successfully";
      return success(res, result, messageSuccess, 201);
    } catch (err) {
      return error(res, "Error", 200);
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
      return success(res, null, messageSuccess, 200);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { oldpassword, newpassword, renewpassword } = req.body;

      const { _id } = req.authorized_user;
      const user: any = await User.findById(_id);
      const check = await bcrypt.compare(oldpassword, user.password);

      if (check) {
        if (oldpassword === newpassword) {
          const messageError = "Newpassword has different from oldpassword";
          return error(res, messageError, 200);
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

          const messageSuccess = "User have been updated successfully";
          return success(res, serializeUpdateUser(user), messageSuccess, 201);
        }
        const messageError = "Re-password invalid";
        return error(res, messageError, 200);
      }
      const messageError = "Oldpassword user unsuccessfully";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, "Error", 200);
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
          return error(res, messageError, 200);
        }

        if (check.status === StatusCode.Deactive) {
          const messageError = "User has been deleted";
          return error(res, messageError, 200);
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
      return error(res, "Error", 200);
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
      return error(res, "Error", 200);
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      const result = await User.findById(
        _id,
        "_id email display_name gender role"
      );
      const messageSuccess = "You have get user successfully";
      return success(res, result, messageSuccess);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  getAllUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      if (role === RoleCode.Admin) {
        const result = await User.find(
          {},
          "_id email display_name gender role status"
        ).sort({ role: 1, status: 1 });
        const messageSuccess = "You have get all user successfully";
        return success(res, result, messageSuccess);
      }
      const messageError = "You cannot get all user, you aren't admin";
      return error(res, messageError, 403);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  changeRoleUser = async (req: Request, res: Response) => {
    try {
      const { role } = req.authorized_user;
      const { newRole } = req.body;
      if (role === RoleCode.Admin) {
        const { user_id } = req.params;
        const user: any = await User.findById(user_id);
        if (newRole === user.role) {
          const messageError = "Newrole has been different from oldrole";
          return error(res, messageError, 200);
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
    } catch (err) {
      return error(res, "Error", 200);
    }
  };
}
