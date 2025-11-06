import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./User";
import { Task } from "./Task";

export enum ProjectStatus {
  PLANNING = "planning",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface ProjectAttributes {
  id: number;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  managerId: number;
  startDate: Date;
  endDate?: Date | null;
}

export interface ProjectCreationAttributes
  extends Optional<
    ProjectAttributes,
    "id" | "status" | "description" | "endDate"
  > {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: number;
  public name!: string;
  public description?: string | null;
  public managerId!: number;
  public status!: ProjectStatus;
  public startDate!: Date;
  public endDate?: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Manager?: User;
  public readonly Tasks?: Task[];

  static associate(models: { User: typeof User; Task: typeof Task }) {
    Project.belongsTo(models.User, {
      foreignKey: "managerId",
      as: "Manager",
    });

    Project.hasMany(models.Task, {
      foreignKey: "projectId",
      as: "tasks",
      onDelete: "CASCADE",
    });
  }
}

export const initProject = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: { notEmpty: true, len: [1, 128] },
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM(...Object.values(ProjectStatus)),
        allowNull: false,
        defaultValue: ProjectStatus.PLANNING,
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "projects",
      freezeTableName: true, // <-- Prevent Sequelize from pluralizing or changing case
      sequelize,
      indexes: [{ fields: ["managerId"] }, { fields: ["status"] }],
    }
  );
};
