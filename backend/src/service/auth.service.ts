import bcrypt from "bcrypt";
import dbPool from "../config/database.config";
import { genericResponse } from "../utils/commonFunctions";
import userService from "./user.service";
import { GenericResponse } from "../types/commonTypes.types";

const authService = {
  register: async (email: string, password: string, role: string) => {
    try {
      const user: GenericResponse = await userService.getUser(email);

      if (user.success) {
        return genericResponse({
          message: "User already exists",
          statusCode: 400,
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const query = "insert into users(email, password, role) values(?, ?, ?)";
      const values = [email, passwordHash, role];

      const [result]: any = await dbPool.query(query, values);

      if (result.affectedRows > 0) {
        return genericResponse({
          success: true,
          message: "User registered successfully",
          statusCode: 201,
        });
      }

      return genericResponse({
        message: "Failed to register user",
        statusCode: 500,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to register user");
    }
  },
  login: async (email: string, password: string) => {
    try {
      const query =
        "select id, email, role, password from users where email = ?";
      const values = [email];

      const [result]: any = await dbPool.query(query, values);

      if (result.length > 0) {
        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return genericResponse({
            success: true,
            message: "User logged in successfully",
            data: {
              email: user.email,
              role: user.role,
              id: user.id,
            },
            statusCode: 200,
          });
        } else {
          return genericResponse({
            message: "Invalid email or password",
            statusCode: 401,
          });
        }
      } else {
        return genericResponse({
          message: "User not found",
          statusCode: 404,
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to login user");
    }
  },
};

export default authService;
