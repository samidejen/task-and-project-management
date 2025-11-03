import { Response, NextFunction } from 'express';
import { Task, TaskStatus } from '../models/Task';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { AuthRequest, Role } from '../middleware/rbac';
import { Op } from 'sequelize';

// Utility to check if a user is the manager of the task's project
const isProjectManagerOfTask = async (req: AuthRequest, task: Task): Promise<boolean> => {
  const project = await task.getProject();
  return project?.managerId === req.user?.id;
};

// @desc    Get all tasks (filtered by role)
// @route   GET /api/tasks
// @access  Private (Admin: all, PM: their project tasks, Employee: assigned tasks)
export const getTasks = async (req: AuthRequest, res: Response) => {
  const userRole = req.user?.role;
  const userId = req.user?.id;
  let whereClause = {};

  try {
    if (userRole === Role.ProjectManager) {
      // PMs get all tasks where the task's project manager is the PM
      const projects = await Project.findAll({ where: { managerId: userId }, attributes: ['id'] });
      const projectIds = projects.map(p => p.id);
      whereClause = { projectId: { [Op.in]: projectIds } };
    } else if (userRole === Role.Employee) {
      // Employees only get tasks assigned to them
      whereClause = { assignedToId: userId };
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: Project, as: 'Project', attributes: ['id', 'name', 'managerId'] },
        { model: User, as: 'AssignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin, ProjectManager - must manage the project)
export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, description, dueDate, projectId, assignedToId } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // Basic validation
    if (!title || !projectId || !assignedToId) {
        return res.status(400).json({ message: 'Title, Project ID, and Assignee ID are required.' });
    }

    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // RBAC Check for Creation: Must be Admin OR the Project Manager
        if (userRole !== Role.Admin && project.managerId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You can only create tasks for projects you manage.' });
        }

        const newTask = await Task.create({
            title,
            description,
            dueDate,
            projectId,
            assignedToId,
            status: 'Pending' as TaskStatus // default status
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating task.' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (Admin, ProjectManager, Employee - restricted update)
export const updateTask = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const updates = req.body;
  const userRole = req.user?.role;
  const userId = req.user?.id;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // RBAC: Check permissions
    if (userRole === Role.Employee) {
      // Employee: Can ONLY update tasks assigned to them, and ONLY the 'status' or 'description'
      if (task.assignedToId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only update tasks assigned to you.' });
      }
      
      const allowedUpdates = ['status', 'description'];
      const incomingKeys = Object.keys(updates);
      
      // Check if any disallowed fields are being updated by an Employee
      const disallowedUpdate = incomingKeys.some(key => !allowedUpdates.includes(key));
      if (disallowedUpdate) {
          return res.status(403).json({ message: 'Forbidden: Employees can only update task status and description.' });
      }
    } else if (userRole === Role.ProjectManager) {
      // PM: Can only update tasks in their projects
      const isManager = await isProjectManagerOfTask(req, task);
      if (!isManager && userRole !== Role.Admin) { // Admin check is technically redundant here, but safe
        return res.status(403).json({ message: 'Forbidden: You can only update tasks in projects you manage.' });
      }
      // PM can update all fields (title, dueDate, assignedToId, etc.)
    }
    // Admin bypasses all checks

    await task.update(updates);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task.' });
  }
};
// ... Add deleteTask, getTaskById logic with similar RBAC checks