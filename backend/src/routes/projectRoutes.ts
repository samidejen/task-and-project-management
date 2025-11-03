import { Router } from 'express';
import { createProject, getProjects, updateProject } from '../controllers/projectController';
import { protect } from '../middleware/auth';
import { checkRole, Role } from '../middleware/rbac';

const router = Router();

// Middleware chain: JWT check -> Role check -> Controller
router.route('/')
  .get(protect, getProjects) // PMs, Admins, Employees can read (filtered by controller)
  .post(protect, checkRole([Role.Admin, Role.ProjectManager]), createProject);

router.route('/:id')
  .put(protect, checkRole([Role.Admin, Role.ProjectManager]), updateProject)
  // .delete(protect, checkRole([Role.Admin, Role.ProjectManager]), deleteProject) // Uncomment when implemented

export default router;