import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};




// 1. Find user by email address
const findUserByEmail = async (email) => {
    const query = `
    SELECT u.user_id, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
`;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};




// 2. Verify plain text password against stored hash using bcrypt
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// 3. Authenticate user credentials
const authenticateUser = async (email, password) => {
    // Step A: Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User not found
    }

    // Step B: Verify the provided password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
        return null; // Invalid password
    }

    // Step C: Remove password_hash before returning user object
    delete user.password_hash;
    
    return user;
};








// Retrieve all users with their roles, ordered by newest first
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, u.role_name, u.created_at
        FROM users u
        ORDER BY u.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

// Optional: Update a user's role (e.g., promote to admin or demote to user)
const updateUserRole = async (userId, roleName) => {
    const query = `
        UPDATE users 
        SET role_name = $1 
        WHERE user_id = $2
    `;
    await db.query(query, [roleName, userId]);
};

// Optional: Remove a user
const deleteUserById = async (userId) => {
    const query = `DELETE FROM users WHERE user_id = $1`;
    await db.query(query, [userId]);
};







export { createUser, authenticateUser, getAllUsers, updateUserRole, deleteUserById };