import { SuccessResponse } from '../../utils';
import { Request, Response } from 'express';

export class apiHealthCheckController {
  public static apiHealthCheck(req: Request, res: Response) {
    const success = new SuccessResponse(res, 'api is working... success!');
    return success.send();
  }
}
