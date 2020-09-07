import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { func, any } from "joi";

export const commonCheckAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      const decoded = jwt.verify(bearerToken, "secret");

      res.locals.user = decoded;
      next();
    }
  } catch (error) {
    return res.json({ Error: "Auth failed" });
  }
};



