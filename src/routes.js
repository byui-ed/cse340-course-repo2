import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';
import { showEditOrganizationForm } from './controllers/organizations.js';
import { processEditOrganizationForm } from './controllers/organizations.js';
import { showNewProjectForm } from './controllers/projects.js';
import { processNewProjectForm } from './controllers/projects.js';
import { projectValidation} from './controllers/projects.js';
import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import { showEditProjectForm, processEditProjectForm, } from './controllers/projects.js';
import { showEditCategoryForm, processEditCategoryForm, categoryValidation } from './controllers/categories.js';
import { showNewCategoryForm, processNewCategoryForm } from './controllers/categories.js';
import { showUserRegistrationForm, processUserRegistrationForm } from './controllers/users.js';
import { showLoginForm, processLoginForm, processLogout } from './controllers/users.js';
import { requireLogin, showDashboard } from './controllers/users.js';
import { requireRole } from './controllers/users.js';





const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);
// Route for project details page
router.get('/project/:id', showProjectDetailsPage);
// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);
// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), processNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', requireRole('admin') ,projectValidation, processNewProjectForm);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
// Route to display the edit project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
// Route to process the edit project form submission with validation
router.post('/edit-project/:id', requireRole('admin') ,projectValidation, processEditProjectForm);
// Route for viewing a specific category and its services/projects
router.get('/category/:id', showCategoryDetailsPage);
// Category Edit Routes
router.get('/category/edit/:id', requireRole('admin'), showEditCategoryForm);
router.post('/category/edit/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
// Route to display new category form
router.get('/new-category', requireRole('admin'), showNewCategoryForm);

// Route to process creation submission
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// GET route to load edit form
router.get('/project/edit/:id', requireRole('admin'), showEditProjectForm);

// POST route to handle form submission
router.post('/project/edit/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login and authentication routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);







// error-handling routes
router.get('/test-error', testErrorPage);

export default router;