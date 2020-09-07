import { Request, Response, NextFunction } from "express";

export const commonCheckSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req!.session!.userId) {
    return res.json({ data: "You're note authencicated. First, you login" });
  }
  next();
};
