// Import any needed model functions
import { getAllProjects } from '../models/projects.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Upcoming Service Projects';

        // Helper function to format SQL DATE into user-friendly text
        const formatDate = (dateString) => {
            if (!dateString) return 'Date TBD';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        };

        res.render('projects', { title, projects, formatDate });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server Error');
    }
};

// Export any controller functions
export { showProjectsPage };