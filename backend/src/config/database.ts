import { Sequelize } from "sequelize";
import { initUser, User } from "../models/User";
import { initProject, Project } from "../models/Project";
import { initTask, Task } from "../models/Task";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Models object
const models = {
  User: User,
  Project: Project,
  Task: Task,
};

// Initialize models
initUser(sequelize);
initProject(sequelize);
initTask(sequelize);

// Setup associations after all models are initialized
if (typeof Project.associate === "function") Project.associate(models);
if (typeof Task.associate === "function") Task.associate(models);
if (typeof User.associate === "function") User.associate(models);

// Connect and sync database
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon Postgres successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { sequelize, models };
