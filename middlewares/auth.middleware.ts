import { generateToken, verifyToken } from "./helper.middleware";
import { Request, Response, NextFunction } from "express";
import { any } from "joi";

const accessTokenSecret = "secret";
// process.env.ACCESS_TOKEN_SECRET

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenFromClient = req.headers["authorization"];

  if (typeof tokenFromClient !== "undefined") {
    try {
      const bearer = tokenFromClient.split(" ");
      const bearerToken = bearer[1];

      const decoded: any = await verifyToken(bearerToken, accessTokenSecret);
      req.authorized_user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }

  // return res.status(403).send({
  //   message: "No token provided",
  // });
};
