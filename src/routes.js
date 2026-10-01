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
import { showNewCategoryForm, processNewCategoryForm, } from './controllers/categories.js';




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
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', processNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
// Route for new project page
router.get('/new-project', showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);
// Route to process the edit project form submission with validation
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
// Route for viewing a specific category and its services/projects
router.get('/category/:id', showCategoryDetailsPage);
// Category Edit Routes
router.get('/category/edit/:id', showEditCategoryForm);
router.post('/category/edit/:id', categoryValidation, processEditCategoryForm);
// Route to display new category form
router.get('/new-category', showNewCategoryForm);

// Route to process creation submission
router.post('/new-category', categoryValidation, processNewCategoryForm);


// GET route to load edit form
router.get('/project/edit/:id', showEditProjectForm);

// POST route to handle form submission
router.post('/project/edit/:id', projectValidation, processEditProjectForm);



// error-handling routes
router.get('/test-error', testErrorPage);

export default router;