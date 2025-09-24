import dbPool from "../config/database.config";
import { genericResponse } from "../utils/commonFunctions";

const skillService = {
  getSkills: async () => {
    try {
      const [result]: any = await dbPool.query("SELECT * FROM skills");

      if (!result || result.length === 0) {
        return genericResponse({
          message: "No skills found",
          statusCode: 404,
        });
      }

      return genericResponse({
        success: true,
        message: "Skills found",
        data: result,
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get skills");
    }
  },

  addSkill: async (data: {
    name: string;
    description?: string;
    is_active?: boolean;
  }) => {
    try {
      await dbPool.query(
        "INSERT INTO skills (name, description, is_active) VALUES (?, ?, ?)",
        [data.name, data.description || null, data.is_active ?? 1]
      );

      return genericResponse({
        success: true,
        message: "Skill added successfully",
        statusCode: 201,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add skill");
    }
  },

  updateSkill: async (
    id: string,
    data: { name?: string; description?: string; is_active?: boolean }
  ) => {
    try {
      await dbPool.query(
        "UPDATE skills SET name = ?, description = ?, is_active = ? WHERE id = ?",
        [data.name, data.description, data.is_active, id]
      );

      return genericResponse({
        success: true,
        message: "Skill updated successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update skill");
    }
  },

  deleteSkill: async (id: string) => {
    try {
      await dbPool.query("DELETE FROM skills WHERE id = ?", [id]);

      return genericResponse({
        success: true,
        message: "Skill deleted successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete skill");
    }
  },
};

export default skillService;
