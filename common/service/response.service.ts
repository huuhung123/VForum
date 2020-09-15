// response.service.ts
import { Response } from "express";
import { any, string } from "joi";

// Return response for API as okay or error as json to request
export const success = (res: Response, data: any, code: any, options: any) => {
  if (!res.headersSent) {
    res.status(code || 200);
    res.json({
      success: true,
      result: data,
      code: code || 200,
      options: options || null,
      error: null,
    });
  }
  // application.log.debug("Res State", res.stateId, "After .send()");
};

export const error = (res: Response, message: any, code: any, opts: any) => {
  const result = {
    success: false,
    result: null,
    code: code || 400,
    error: message,
    errorType: any,
  };
  // Override to not show
  if (opts) {
    if (opts.errorType) {
      result.errorType = opts.errorType;
    }
    // result.errorType = "Invalid";
  }

  if ((!opts || !opts.loggingOnly) && !res.headersSent) {
    res.status(code || 400);
    res.json(result);
  }
};

export const raw = (res: Response, message: any, code: any) => {
  res.status(code || 400);
  res.write(message);
  res.end();
};
