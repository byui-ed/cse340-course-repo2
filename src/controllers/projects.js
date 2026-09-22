// Import any needed model functions
import { getAllProjects } from '../models/projects.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Upcoming Service Projects';

    // Helper function to format SQL DATE into user-friendly text
    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    res.render('projects', { title, projects, formatDate });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projects = await getAllProjects();
    const projectDetails = projects.find(project => project.project_id === parseInt(projectId));
    const title = 'Project Details';

    res.render('project', { title, projectDetails });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };