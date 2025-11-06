import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import { Role } from "../middleware/rbac";
import { Project } from "./Project";
import { Task } from "./Task";

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: Role;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async comparePassword(
    candidatePassword: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hash);
  }

  static associate(models: { Project: typeof Project; Task: typeof Task }) {
    // A User can manage many Projects
    User.hasMany(models.Project, {
      foreignKey: "managerId",
      as: "ManagedProjects",
    });

    // A User can be assigned many Tasks
    User.hasMany(models.Task, {
      foreignKey: "assignedToId",
      as: "AssignedTasks",
    });
  }
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: { type: DataTypes.STRING(128), allowNull: false },
      lastName: { type: DataTypes.STRING(128), allowNull: false },
      email: { type: DataTypes.STRING(128), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(128), allowNull: false },
      role: {
        type: DataTypes.ENUM(...Object.values(Role)),
        allowNull: false,
        defaultValue: Role.Employee,
      },
    },
    {
      tableName: "users", // lowercase to match Postgres table
      freezeTableName: true, // prevent Sequelize from changing table name
      sequelize,
      hooks: {
        beforeCreate: async (user: User) => {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        },
      },
    }
  );
};
