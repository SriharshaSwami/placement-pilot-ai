$modules = @("auth", "users", "resumes", "jobs", "applications", "interviews", "ai", "dashboard")

foreach ($module in $modules) {
    # Controller
    $controllerContent = @"
import { successResponse } from '../utils/responseFormatter.js';
import asyncHandler from '../utils/asyncHandler.js';

export const scaffold$($module.Substring(0,1).ToUpper() + $module.Substring(1)) = asyncHandler(async (req, res) => {
  return successResponse(res, 200, '$module endpoint scaffolded');
});
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\server\src\controllers\$module.controller.js" -Value $controllerContent -Encoding UTF8

    # Service
    $serviceContent = @"
export const process$($module.Substring(0,1).ToUpper() + $module.Substring(1)) = async (data) => {
  // TODO: Implement business logic
  return { status: 'scaffold', data };
};
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\server\src\services\$module.service.js" -Value $serviceContent -Encoding UTF8

    # Route
    $routeContent = @"
import express from 'express';
import { scaffold$($module.Substring(0,1).ToUpper() + $module.Substring(1)) } from '../controllers/$module.controller.js';

const router = express.Router();

router.get('/', scaffold$($module.Substring(0,1).ToUpper() + $module.Substring(1)));

export default router;
"@
    Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\server\src\routes\$module.routes.js" -Value $routeContent -Encoding UTF8
}

# Central Router
$indexRouterContent = @"
import express from 'express';

import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import resumesRoutes from './resumes.routes.js';
import jobsRoutes from './jobs.routes.js';
import applicationsRoutes from './applications.routes.js';
import interviewsRoutes from './interviews.routes.js';
import aiRoutes from './ai.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/resumes', resumesRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/interviews', interviewsRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
"@

Set-Content -Path "c:\Users\sriha\OneDrive\Desktop\Projects\placement-assistance-ai\server\src\routes\index.js" -Value $indexRouterContent -Encoding UTF8
