import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppSecretMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const secret = req.headers['app_secret'];
    if (!secret) {
      return res
        .status(401)
        .json({ status: 'failed', message: 'Secret Token Not Provided' });
    }
    if (secret !== process.env.APP_SECRET) {
      return res
        .status(401)
        .json({ status: 'failed', message: 'Secret Provided Is Not Correct' });
    }
    next();
  }
}
