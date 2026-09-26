import db from './db.js';

// Retrieve all service projects with partner organization names
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

// Retrieve projects associated with a specific organization
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date ASC;
    `;
    
    const queryParams = [parseInt(organizationId, 10)];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Retrieve a single category by its ID
const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [parseInt(categoryId, 10)]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all service projects associated with a category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        JOIN public.project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;
    
    const result = await db.query(query, [parseInt(categoryId, 10)]);
    return result.rows;
};

// Export all model functions from a single unified export block
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getCategoryDetails, 
    getProjectsByCategoryId 
};