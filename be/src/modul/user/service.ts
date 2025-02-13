import User from "./model";
import { Op } from "sequelize";

class UserService {
  static async createUser(data: Partial<User>) {
    return await User.create(data);
  }

  static async getAllUsers(filters?: Partial<User>) {
    return await User.findAll({
      where: filters ? filters : {},
    });
  }

  static async getUserById(user_id: number) {
    return await User.findByPk(user_id);
  }

  static async updateUser(user_id: number, data: Partial<User>) {
    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    return await user.update(data);
  }

  static async deleteUser(user_id: number) {
    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found");

    return await user.destroy();
  }
}

export default UserService;
