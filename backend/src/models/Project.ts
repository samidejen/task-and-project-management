import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { User } from './User'; 
import { Task } from './Task';

export interface ProjectAttributes {
  id: number;
  name: string;
  description: string;
  // User who owns/manages the project (must be Admin/ProjectManager)
  managerId: number; 
}

export interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public managerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Manager?: User;
  public readonly Tasks?: Task[];

  static associate(models: { User: typeof User; Task: typeof Task }) {
    // A Project is owned by one Manager
    Project.belongsTo(models.User, {
      foreignKey: 'managerId',
      as: 'Manager',
    });
    // A Project has many Tasks
    Project.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'Tasks',
      onDelete: 'CASCADE',
    });
  }
}

export const initProject = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      description: {
        type: new DataTypes.TEXT(),
        allowNull: true,
      },
      managerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users', // table name
          key: 'id',
        },
      },
    },
    {
      tableName: 'Projects',
      sequelize,
    }
  );
};