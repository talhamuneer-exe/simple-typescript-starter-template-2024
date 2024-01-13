/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
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
