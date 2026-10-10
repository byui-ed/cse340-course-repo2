import { getAllUsers, updateUserRole, deleteUserById } from '../models/users.js';

// GET: Render Admin Dashboard with Users List
const showAdminDashboard = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.render('admin-dashboard', {
            title: 'Admin Dashboard - User Management',
            user: req.session.user,
            users
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        req.flash('error', 'Unable to retrieve user list.');
        res.redirect('/dashboard');
    }
};

// POST: Update User Role (Admin action)
const changeUserRole = async (req, res) => {
    const { userId, roleName } = req.body;
    
    // Prevent an admin from demoting themselves
    if (parseInt(userId) === req.session.user.user_id) {
        req.flash('error', 'You cannot change your own admin role.');
        return res.redirect('/admin/dashboard');
    }

    try {
        await updateUserRole(userId, roleName);
        req.flash('success', 'User role updated successfully.');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error updating user role:', error);
        req.flash('error', 'Failed to update user role.');
        res.redirect('/admin/dashboard');
    }
};

// POST: Delete User (Admin action)
const removeUser = async (req, res) => {
    const { userId } = req.body;

    // Prevent an admin from deleting themselves
    if (parseInt(userId) === req.session.user.user_id) {
        req.flash('error', 'You cannot delete your own account from here.');
        return res.redirect('/admin/dashboard');
    }

    try {
        await deleteUserById(userId);
        req.flash('success', 'User removed successfully.');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'Failed to remove user.');
        res.redirect('/admin/dashboard');
    }
};



const getUsersList = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('admin/users-list', {
            title: 'User Management',
            users
        });
    } catch (error) {
        console.error('Error fetching users list:', error);
        req.flash('error', 'Unable to retrieve users list.');
        res.redirect('/admin/dashboard');
    }
};



export {
    showAdminDashboard,
    getUsersList,
    changeUserRole,
    removeUser
};