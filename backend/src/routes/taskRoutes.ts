// backend/src/routes/taskRoutes.ts
import { Router } from 'express';
import { getTasks, createTask, updateTask } from '../controllers/taskController';
import { protect } from '../middleware/auth';
import { checkRole, Role } from '../middleware/rbac';

const router = Router();

router.route('/')
    .get(protect, getTasks) // Everyone can read (filtered by controller)
    .post(protect, checkRole([Role.Admin, Role.ProjectManager]), createTask);

router.route('/:id')
    .put(protect, updateTask) // Update logic handles all role permissions internally
    // .delete(protect, checkRole([Role.Admin, Role.ProjectManager]), deleteTask); // Uncomment when implemented

export default router;