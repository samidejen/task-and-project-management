import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./User";
import { Project } from "./Project";

export type TaskStatus = "Pending" | "InProgress" | "Complete";

export interface TaskAttributes {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  projectId: number;
  assignedToId: number;
}

export interface TaskCreationAttributes
  extends Optional<TaskAttributes, "id" | "status" | "dueDate"> {}

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: TaskStatus;
  public dueDate!: Date | null;
  public projectId!: number;
  public assignedToId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Project?: Project;
  public readonly AssignedTo?: User;

  static associate(models: { User: typeof User; Project: typeof Project }) {
    Task.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "Project",
      onDelete: "CASCADE",
    });

    Task.belongsTo(models.User, {
      foreignKey: "assignedToId",
      as: "AssignedTo",
    });
  }
}

export const initTask = (sequelize: Sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING(128), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM("Pending", "InProgress", "Complete"),
        defaultValue: "Pending",
        allowNull: false,
      },
      dueDate: { type: DataTypes.DATE, allowNull: true },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "projects", key: "id" }, // lowercase table name
      },
      assignedToId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" }, // lowercase table name
      },
    },
    {
      tableName: "tasks",
      freezeTableName: true, // prevents Sequelize from changing table name
      sequelize,
    }
  );
};
