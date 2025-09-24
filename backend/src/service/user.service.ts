import dbPool from "../config/database.config";
import { genericResponse } from "../utils/commonFunctions";

const userService = {
  getUser: async (email: string) => {
    try {
      const query = "select * from users where email = ?";
      const values = [email];
      const [result]: any = await dbPool.query(query, values);

      if (result.length === 0) {
        return genericResponse({
          message: "User not found",
          statusCode: 404,
        });
      } else {
        return genericResponse({
          success: true,
          message: "User found",
          data: result[0],
          statusCode: 200,
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get user");
    }
  },
};

export default userService;
