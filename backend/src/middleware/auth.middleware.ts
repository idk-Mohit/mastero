import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

function signAccessToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, config.jwt.secret, { expiresIn: "15m" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_COOKIE];
  const refreshToken = req.cookies[REFRESH_COOKIE];

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ user: null, error: "Unauthorized" });
  }

  try {
    // ✅ Access token works
    const payload = jwt.verify(
      accessToken,
      config.jwt.secret
    ) as jwt.JwtPayload;
    (req as any).user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (err: any) {
    // ❌ If expired, try refresh
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const payload = jwt.verify(
          refreshToken,
          config.jwt.refreshSecret
        ) as jwt.JwtPayload;

        // Issue new access token
        const newAccessToken = signAccessToken({
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });

        res.cookie(ACCESS_COOKIE, newAccessToken, {
          httpOnly: true,
          secure: config.node_env === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 mins
        });

        (req as any).user = {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        };

        return next();
      } catch {
        // Refresh also invalid → log out
        res.clearCookie(ACCESS_COOKIE);
        res.clearCookie(REFRESH_COOKIE);
        return res.status(401).json({ user: null, error: "Session expired" });
      }
    }

    return res.status(401).json({ user: null, error: "Unauthorized" });
  }
}
