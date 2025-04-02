import Gambar from "../gambar/model.js";
import User from "./model.js";
import { Op } from "sequelize";

interface UserFilters {
  nama?: string;
  email?: string;
  kelamin?: string;
}

export const getAllSiswa = async (filters: UserFilters, page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {
    role: "siswa",
    deletedAt: { [Op.is]: null }, // Filter hanya data yang belum dihapus
  };

  if (filters.nama) {
    whereClause.nama = { [Op.like]: `%${filters.nama}%` };
  }
  if (filters.email) {
    whereClause.email = { [Op.like]: `%${filters.email}%` };
  }
  if (filters.kelamin) {
    whereClause.kelamin = filters.kelamin;
  }

  // Hitung total data
  const totalData = await User.count({ where: whereClause });

  // Ambil data user dengan paginasi
  const users: any = await User.findAll({
    where: whereClause,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    data: users,
    totalData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      limit,
    },
  };
};
export class UserService {
  static async createUser(data: Partial<User>) {
    return await User.create(data);
  }
  static async getUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }
  static async getAllUsers(filters?: Partial<User>) {
    return await User.findAll({
      where: filters ? filters : {},
    });
  }

  static async getUserById(user_id: number) {
    return await User.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: Gambar,
          required: false,
        },
      ],
    });
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
