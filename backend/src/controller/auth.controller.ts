// @ts-nocheck

import { Request, Response } from "express";
import authService from "../service/auth.service";
import { asyncHandler } from "../utils/commonFunctions";
import { GenericResponse } from "../types/commonTypes.types";
import jwt from "jsonwebtoken";
import { config } from "../config";

const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response: GenericResponse = await authService.register(
      email,
      password,
      "user"
    );
    res.status(response.statusCode ?? 200).json(response);
  }),
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response: GenericResponse = await authService.login(email, password);

    if (response.success) {
      const accessToken = jwt.sign(
        { email, role: response.data?.role, id: response.data?.id },
        config.jwt.secret,
        {
          expiresIn: "30m", // TTL for access token
        }
      );

      const refreshToken = jwt.sign(
        { email, role: response.data?.role, id: response.data?.id },
        config.jwt.refreshSecret,
        {
          expiresIn: "7d", // TTL for refresh token
        }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });
    }
    res.status(response.statusCode ?? 200).json(response);
  }),
  logout: asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json({
      data: null,
      statusCode: 200,
      success: true,
      message: "User logged out",
    });
  }),
  me: asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({
      data: (req as any).user,
      statusCode: 200,
      success: true,
      message: "User session found",
    });
  }),
};

export default authController;
