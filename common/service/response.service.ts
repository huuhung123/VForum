// response.service.ts
import { Request, Response } from "express";

export const successHandler = (
  res: Response,
  data: any,
  message?: any,
  code?: any,
  options?: any
) => {
  if (!res.headersSent) {
    res.status(code || 200);
    res.json({
      success: true,
      result: data,
      message,
      code: code || 200,
      options: options || null,
      error: null,
    });
  }
};

export const errorHandler = (
  req: Request,
  res: Response,
  error: any,
  code?: any,
  opts?: any,
) => {
  const result = {
    success: false,
    message: error.message || "Internal server",
    code: code || 500,
    options: opts || null,
  };

  if ((!opts || !opts.loggingOnly) && !res.headersSent) {
    res.status(code || 400);
    res.json(result);
  }
};