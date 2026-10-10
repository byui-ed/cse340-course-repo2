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

// Retrieve details for a single project by ID
const getProjectDetails = async (projectId) => {
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
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [parseInt(projectId, 10)]);
    return result.rows.length > 0 ? result.rows[0] : null;
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

// Create a new project record and return its ID
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};



// Update existing project in database
const updateProject = async (projectId, { title, description, date, location, organizationId }) => {
    const query = `
        UPDATE public.project 
        SET 
            title = $1, 
            description = $2, 
            date = $3, 
            location = $4, 
            organization_id = $5 
        WHERE project_id = $6 
        RETURNING project_id;
    `;
    const values = [
        title, 
        description, 
        date, 
        location, 
        parseInt(organizationId, 10), 
        parseInt(projectId, 10)
    ];
    const result = await db.query(query, values);
    return result.rows.length > 0 ? result.rows[0].project_id : null;
};




// Retrieve all services linked to a specific project ID
const getServicesByProjectId = async (projectId) => {
    const query = `
        SELECT 
            s.service_id,
            s.service_name,
            s.description
        FROM public.service s
        JOIN public.project_service ps ON s.service_id = ps.service_id
        WHERE ps.project_id = $1
        ORDER BY s.service_name ASC;
    `;
    
    const result = await db.query(query, [parseInt(projectId, 10)]);
    return result.rows;
};



const getAllProjectsWithServices = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            o.name AS organization_name,
            COALESCE(
                json_agg(
                    json_build_object(
                        'service_id', s.service_id,
                        'service_name', s.service_name,
                        'description', s.description
                    )
                ) FILTER (WHERE s.service_id IS NOT NULL), '[]'
            ) AS services
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        LEFT JOIN public.project_service ps ON p.project_id = ps.project_id
        LEFT JOIN public.service s ON ps.service_id = s.service_id
        GROUP BY p.project_id, o.name
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};




// Retrieve project details by ID
const getProjectById = async (projectId) => {
    const query = `
        SELECT 
            project_id,
            title,
            description,
            date,
            location,
            organization_id
        FROM public.project 
        WHERE project_id = $1;
    `;
    const result = await db.query(query, [parseInt(projectId, 10)]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all organizations for select dropdown
const getAllOrganizations = async () => {
    const query = `SELECT organization_id, name FROM public.organization ORDER BY name ASC;`;
    const result = await db.query(query);
    return result.rows;
};





const updateProjectCategories = async (projectId, categoryIds) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Delete existing category assignments for this project
        await client.query('DELETE FROM project_categories WHERE project_id = $1', [projectId]);

        // Insert new category assignments
        if (categoryIds.length > 0) {
            const insertQuery = `
                INSERT INTO project_categories (project_id, category_id) 
                VALUES ` + categoryIds.map((_, i) => `($1, $${i + 2})`).join(', ');
            
            await client.query(insertQuery, [projectId, ...categoryIds]);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};



// Add a volunteer entry for a project
const addProjectVolunteer = async (projectId, userId, details) => {
    const { phone, availability, skills, notes, emergencyName, emergencyPhone } = details;
    
    const query = `
        INSERT INTO project_volunteers 
            (project_id, user_id, phone, availability, skills, notes, emergency_name, emergency_phone, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (project_id, user_id) 
        DO UPDATE SET 
            phone = EXCLUDED.phone,
            availability = EXCLUDED.availability,
            skills = EXCLUDED.skills,
            notes = EXCLUDED.notes,
            emergency_name = EXCLUDED.emergency_name,
            emergency_phone = EXCLUDED.emergency_phone
        RETURNING *
    `;

    const values = [
        projectId,
        userId,
        phone,
        availability,
        skills || null,
        notes || null,
        emergencyName,
        emergencyPhone
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};



// Export all model functions from a single unified export block
export { 
    getAllProjects, 
    getProjectDetails,
    getProjectsByOrganizationId, 
    getCategoryDetails, 
    getProjectsByCategoryId, 
    createProject,
    updateProject,
    getServicesByProjectId, 
    getAllProjectsWithServices,
    getProjectById, getAllOrganizations, 
    updateProjectCategories, 
    addProjectVolunteer
};