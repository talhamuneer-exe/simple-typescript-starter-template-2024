import { NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

export const requestId = (
  _req: Request,
  _res: Response,
  _next: NextFunction,
): void => {
  const uuid = uuidV4();
  const reqExtended = _req as Request & { id: string };
  const resExtended = _res as Response & { id: string };
  reqExtended.id = uuid;
  resExtended.id = uuid;
  _next();
};
