import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import superagent from "superagent";
import jose from "node-jose";

class AuthProvider {
  private pubKey: string | undefined = undefined;

  constructor() {}

  public async authenticateRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).send();
      return;
    }
    if (!token.toLowerCase().startsWith("bearer ")) {
      res.status(403).send();
      return;
    }

    const jwtToken = token.split(" ")[1];
    await this.getPubKey();
    const keyStore = await jose.JWK.asKeyStore(this.pubKey as string);
    const rawDecodedToken = jwt.decode(jwtToken, {
      complete: true,
    });
    if (!rawDecodedToken) {
      res.status(403).send();
      return;
    }
    const tokenContent = jwt.verify(
      jwtToken,
      keyStore.get(rawDecodedToken.header.kid as string).toPEM(),
      {}
    ) as jwt.JwtPayload;

    if (
      tokenContent.aud === "https://webpusher/" &&
      tokenContent.iss === "https://matthew-auth.us.auth0.com/"
    ) {
      req.token = tokenContent;
      next();
      return;
    } else {
      res.status(403).send();
      return;
    }
  }

  private async getPubKey() {
    if (this.pubKey) {
      return this.pubKey;
    }
    const key = await superagent.get(
      "https://matthew-auth.us.auth0.com/.well-known/jwks.json"
    );

    this.pubKey = JSON.stringify(key.body);

    return this.pubKey;
  }
}

const authProvider = new AuthProvider();

export default authProvider;
