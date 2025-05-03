import { NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
export const requestId = (
  _req: Request,
  _res: Response,
  _next: NextFunction,
): void => {
  const uuid = uuidV4();
  _req.id = uuid;
  _res.id = uuid;
  _next();
};
