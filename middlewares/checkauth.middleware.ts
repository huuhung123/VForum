import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const commonCheckAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const bearerHeader = req.headers["authorization"];
  //   if (typeof bearerHeader !== "undefined") {
  //     const bearer = bearerHeader.split(" ");
  //     const bearerToken = bearer[1];
  //     const decoded = await jwt.verify(bearerToken, "secret");
  //     if (req!.session!.user) {
  //       return next;
  //     }
  //     return res.json({ Error: "Auth failed" });
  //   }
  //   return res.json({ Error: "Forbidden" });
  // } catch (error) {
  //   return res.json({ Error: error });
  // }
  console.log(req!.session!.user)
  if (req!.session!.user) {
    return next()
  }
  return res.json({Error: "Session fault"})
};
