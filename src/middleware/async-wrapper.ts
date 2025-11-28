import { NextFunction, Request, Response, RequestHandler } from 'express';

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncWrapper = (
  asyncRouteHandler: AsyncRequestHandler,
): RequestHandler => {
  return function (
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    Promise.resolve(asyncRouteHandler(request, response, next)).catch(next);
  };
};
