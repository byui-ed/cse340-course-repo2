// Import any needed model functions
import { getAllProjects, createProject, getProjectDetails, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { getServicesByProjectId } from '../models/projects.js';
import { getAllProjectsWithServices } from '../models/projects.js';
import { getProjectById } from '../models/projects.js';

// Form validation rules for project updates
const projectValidation = [
    body('title').trim().notEmpty().withMessage('Project title is required.'),
    body('organizationId').notEmpty().withMessage('Organization selection is required.'),
    body('date').isISO8601().withMessage('Valid date is required.'),
    body('location').trim().notEmpty().withMessage('Location is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.')
];



const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjectsWithServices();
        res.render('projects', { 
            title: 'Upcoming Service Projects', 
            projects 
        });
    } catch (error) {
        console.error('Error fetching projects with services:', error);
        req.flash('error', 'Unable to load projects.');
        res.redirect('/');
    }
};


const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        // Fetch services connected to this project
        const services = await getServicesByProjectId(projectId);

        res.render('project', { 
            title: projectDetails.title, 
            projectDetails, 
            services 
        });
    } catch (error) {
        console.error('Error loading project details:', error);
        req.flash('error', 'Unable to load project details.');
        res.redirect('/projects');
    }
};


const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    const newProjectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
};


// GET: Show Edit Project Details Form
const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        res.render('edit-project', {
            title: `Edit ${project.title}`,
            project,
            organizations
        });
    } catch (error) {
        console.error('Error rendering edit project form:', error);
        req.flash('error', 'Unable to load edit page.');
        res.redirect('/projects');
    }
};



// POST: Process Edit Project Submission
const processEditProjectForm = async (req, res) => {
    const errors = validationResult(req);
    const projectId = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/project/edit/${projectId}`);
    }

    try {
        const { title, description, date, location, organizationId } = req.body;
        await updateProject(projectId, { title, description, date, location, organizationId });
        req.flash('success', 'Project details updated successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error updating project details:', error);
        req.flash('error', 'Failed to update project details.');
        res.redirect(`/project/edit/${projectId}`);
    }
};









// Export any controller functions
export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm,
    processEditProjectForm,
    projectValidation 
};