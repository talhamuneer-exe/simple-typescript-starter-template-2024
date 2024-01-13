/* eslint-disable functional/prefer-immutable-types */
import { NextFunction, Request, Response } from 'express';

import { logger } from '../utils';

type ExpressMiddleware = (
  request: Request,
  response: Response,
  next?: NextFunction,
) => Promise<unknown>;

export const asyncWrapper = (asyncRouteHandler: ExpressMiddleware) => {
  return function (
    request: Request,
    response: Response,
    next: NextFunction,
  ): unknown {
    return asyncRouteHandler(request, response, next)
      .then((res) => {
        logger.getAiClient().flush();
        return res;
      })
      .catch(next);
  };
};
