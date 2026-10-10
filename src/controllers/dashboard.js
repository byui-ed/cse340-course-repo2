import { getVolunteeredProjectsByUserId } from '../models/projects.js';



const showDashboardPage = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const volunteeredProjects = await getVolunteeredProjectsByUserId(userId);

        res.render('dashboard', {
            title: 'User Dashboard',
            user: req.session.user,
            volunteeredProjects
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        req.flash('error', 'Unable to load dashboard.');
        res.redirect('/');
    }
};










export { showDashboardPage };