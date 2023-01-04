import jwt from "jsonwebtoken";

export {};

declare global {
  namespace Express {
    export interface Request {
      token?: jwt.JwtPayload;
    }
  }
}
