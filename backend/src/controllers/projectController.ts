import { Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { AuthRequest, Role } from "../middleware/rbac";
import { Op } from "sequelize";

// Utility to check if a user is the project manager
const isProjectManager = (req: AuthRequest, project: Project): boolean => {
  return req.user?.id === project.managerId;
};

// @desc    Get all projects (filtered by role)
// @route   GET /api/projects
// @access  Private (Admin: all, PM: only their projects)
export const getProjects = async (req: AuthRequest, res: Response) => {
  const userRole = req.user?.role;
  const userId = req.user?.id;
  let whereClause = {};

  if (userRole === Role.ProjectManager || userRole === Role.Employee) {
    // PMs only see their projects. Employees see projects they are assigned to (via tasks).
    // For simplicity here, we'll align employees with PM access for now,
    // but a proper join/subquery is needed for an employee view.
    // We will refine this in the ProjectManagerDashboard.
    whereClause = { managerId: userId };
  }

  try {
    const projects = await Project.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "Manager",
          attributes: ["id", "firstName", "lastName"],
        },
        { model: Task, as: "tasks", attributes: ["id", "title", "status"] },
      ],
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin, ProjectManager)
export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description, managerId } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required." });
  }

  try {
    // Only assign manager if provided and exists
    let assignedManagerId: number | null = null;
    if (managerId) {
      const user = await User.findByPk(managerId);
      if (!user) {
        return res.status(400).json({ message: "Manager not found." });
      }
      assignedManagerId = managerId;
    }

    const newProject = await Project.create({
      name,
      description,
      managerId: assignedManagerId, // can be null now
    });

    res.status(201).json(newProject);
  } catch (error) {
    if ((error as any).name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Project name must be unique." });
    }
    console.error(error);
    res.status(500).json({ message: "Server error creating project." });
  }
};
// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin, ProjectManager - must be owner)
export const updateProject = async (req: AuthRequest, res: Response) => {
  const projectId = req.params.id;
  const updates = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // RBAC: Admin always has access, or Project Manager must own the project
    if (req.user?.role !== Role.Admin && !isProjectManager(req, project)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own projects." });
    }

    await project.update(updates);
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating project." });
  }
};
// ... Add deleteProject and getProjectById similar logic
