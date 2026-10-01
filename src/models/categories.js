import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT 
            category_id, 
            category_name
        FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM public.categories
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
};


const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}


// Retrieve services connected to a specific category through projects
const getServicesByCategoryId = async (categoryId) => {
    const query = `
        SELECT DISTINCT 
            s.service_id,
            s.service_name,
            s.description
        FROM public.service s
        JOIN public.project_service ps ON s.service_id = ps.service_id
        JOIN public.project_category pc ON ps.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY s.service_name ASC;
    `;
    const result = await db.query(query, [parseInt(categoryId, 10)]);
    return result.rows;
};

// Retrieve projects assigned to a category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location
        FROM public.project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [parseInt(categoryId, 10)]);
    return result.rows;
};




// Update existing category in database
const updateCategory = async (id, categoryName) => {
    const query = `
        UPDATE public.categories 
        SET category_name = $1 
        WHERE category_id = $2 
        RETURNING category_id;
    `;
    const result = await db.query(query, [categoryName, parseInt(id, 10)]);
    return result.rows.length > 0 ? result.rows[0].category_id : null;
};



// Retrieve category details by ID
const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, category_name 
        FROM public.categories 
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [parseInt(id, 10)]);
    return result.rows.length > 0 ? result.rows[0] : null;
};



// Create a new category in PostgreSQL
const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO public.categories (category_name) 
        VALUES ($1) 
        RETURNING category_id;
    `;
    const result = await db.query(query, [categoryName]);
    return result.rows[0].category_id;
};





// Export the model functions
export { getAllCategories, getCategoryDetails, updateCategoryAssignments, getServicesByCategoryId, getProjectsByCategoryId, updateCategory, getCategoryById, createCategory };