import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function verifyToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Check if the header starts with "Bearer "
  if (token.startsWith('Bearer ')) {
    // Remove "Bearer " prefix
    token = token.slice(7);
  }
  jwt.verify(token, process.env.SECRET_KEY!, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.headers['empId'] = decoded.employeeId;
    // Continue to the next middleware or route handler
    next();
  });
}

export default verifyToken;
