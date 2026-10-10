// Import any needed model functions
import { getAllProjects, createProject, getProjectDetails, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { getServicesByProjectId } from '../models/projects.js';
import { getAllProjectsWithServices } from '../models/projects.js';
import { getProjectById } from '../models/projects.js';

import { addProjectVolunteer } from '../models/projects.js';





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





// Controller handler
const showAllProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects(); // <--- Usage removes the error
        
        res.render('projects', {
            title: 'All Projects',
            projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        req.flash('error', 'Unable to load projects.');
        res.redirect('/');
    }
};







// GET: Render Volunteer Signup Form Page
const showVolunteerForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        res.render('volunteer-signup', {
            title: `Volunteer Sign-Up - ${project.title}`,
            project,
            user: req.session.user || res.locals.user
        });
    } catch (error) {
        console.error('Error rendering volunteer signup form:', error);
        req.flash('error', 'Unable to load sign-up form.');
        res.redirect('/projects');
    }
};

// POST: Submit Volunteer Form Application
const processVolunteerSignup = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user ? req.session.user.user_id : null;

    if (!userId) {
        req.flash('error', 'You must be logged in to volunteer.');
        return res.redirect('/login');
    }

    try {
        const { phone, availability, skills, notes, emergencyName, emergencyPhone } = req.body;

        await addProjectVolunteer(projectId, userId, {
            phone,
            availability,
            skills,
            notes,
            emergencyName,
            emergencyPhone
        });

        req.flash('success', 'Thank you! Your volunteer application has been submitted.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error processing volunteer signup:', error);
        req.flash('error', 'Failed to submit volunteer application. Please try again.');
        res.redirect(`/project/${projectId}/volunteer`);
    }
};













// POST: Add logged-in user as volunteer
const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addProjectVolunteer(projectId, userId, req.body);
        req.flash('success', 'You have successfully signed up to volunteer for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'Failed to sign up as a volunteer.');
        res.redirect(`/project/${projectId}`);
    }
};

// POST: Remove logged-in user as volunteer
const unvolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    const redirectSource = req.body.source; // Detect if request originated from dashboard

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer from this project.');

        if (redirectSource === 'dashboard') {
            return res.redirect('/dashboard');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Failed to remove volunteer status.');
        res.redirect(`/project/${projectId}`);
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
    projectValidation ,
    showAllProjectsPage, volunteerForProject, unvolunteerFromProject, showVolunteerForm, processVolunteerSignup
};




















