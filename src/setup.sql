-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


SELECT * FROM organization;




-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);



-- 2. Insert Categories
INSERT INTO categories (category_name) VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')
ON CONFLICT (category_name) DO NOTHING;













-- Clean up existing tables if recreating the schema
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ========================================
-- 1. Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Sample Data: Organizations
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ========================================
-- 2. Categories Table
-- ========================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Sample Data: Categories
INSERT INTO categories (category_name) VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')
ON CONFLICT (category_name) DO NOTHING;


-- ========================================
-- 3. Project Table
-- ========================================
-- One-to-Many Relationship: An organization can host multiple projects.
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    organization_id INT NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id) 
        ON DELETE CASCADE
);

-- Sample Data: Projects
INSERT INTO project (title, description, organization_id)
VALUES
('Neighborhood Park Clean-up', 'Cleaning up trash and planting trees in local community parks.', 1),
('Urban Farming Workshop', 'Teaching high school students how to grow their own organic vegetables.', 2),
('Senior Center Outreach', 'Organizing social activities and wellness checks for elderly residents.', 3);


-- ========================================
-- 4. Project Categories Junction Table
-- ========================================
-- Many-to-Many Relationship: 
-- A project can have multiple categories, and a category can belong to multiple projects.
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project 
        FOREIGN KEY (project_id) 
        REFERENCES project(project_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_category 
        FOREIGN KEY (category_id) 
        REFERENCES categories(category_id) 
        ON DELETE CASCADE
);

-- Sample Data: Associate Projects with Categories
INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1), -- Neighborhood Park Clean-up -> Environmental
(1, 3), -- Neighborhood Park Clean-up -> Community Service
(2, 1), -- Urban Farming Workshop -> Environmental
(2, 2), -- Urban Farming Workshop -> Educational
(3, 3), -- Senior Center Outreach -> Community Service
(3, 4); -- Senior Center Outreach -> Health and Wellness












-- Clean up existing tables
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Organization Table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on sustainable construction.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- 2. Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (category_name) VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')
ON CONFLICT (category_name) DO NOTHING;

-- 3. Project Table (Includes date and location)
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    organization_id INT NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id) 
        ON DELETE CASCADE
);

-- Sample Data: 5 Projects for each of the 3 Organizations
INSERT INTO project (title, description, date, location, organization_id)
VALUES
-- BrightFuture Builders (ID: 1)
('Community Center Ramp Installation', 'Building wheelchair ramps for local community hubs.', '2026-10-05', '123 Main St, Downtown', 1),
('Affordable Housing Framing', 'Assisting with framing new affordable housing units.', '2026-10-12', '456 Oak Ave, Eastside', 1),
('Playground Restoration Project', 'Repairing and repainting wooden playground structures.', '2026-10-20', 'Lincoln Park, West End', 1),
('Energy Efficient Insulation Upgrade', 'Installing proper insulation in community centers.', '2026-11-01', '789 Pine Rd, Northside', 1),
('Youth Workshop Buildout', 'Constructing a woodshop classroom for local youth.', '2026-11-15', '101 Maple St, Southside', 1),

-- GreenHarvest Growers (ID: 2)
('Neighborhood Garden Planting', 'Planting seasonal vegetables in community plots.', '2026-10-02', 'Riverfront Community Garden', 2),
('High School Greenhouse Setup', 'Building raised garden beds and setting up drip irrigation.', '2026-10-18', 'Central High School', 2),
('Composting Workshop & Bin Build', 'Teaching zero-waste composting techniques.', '2026-10-25', 'GreenHarvest Hub', 2),
('Urban Orchard Tree Planting', 'Planting fruit trees across public park lands.', '2026-11-08', 'Sunrise Park', 2),
('Vertical Hydroponics Installation', 'Setting up indoor growing racks for year-round greens.', '2026-11-22', 'Community Food Bank', 2),

-- UnityServe Volunteers (ID: 3)
('Senior Center Health & Wellness Check', 'Organizing social activities and wellness check-ins.', '2026-10-08', 'Golden Years Retirement Home', 3),
('Annual Food Pantry Drive', 'Collecting and sorting non-perishable goods.', '2026-10-14', 'UnityServe Center', 3),
('After-School Tutoring Session', 'Helping primary school students with homework.', '2026-10-29', 'Public Library Branch', 3),
('Warm Coats & Clothing Drive', 'Sorting and distributing winter coats.', '2026-11-05', 'Civic Center Plaza', 3),
('Holiday Meal Preparation', 'Preparing and packaging meals for shelter distribution.', '2026-11-20', 'St. Jude Kitchen', 3);

-- 4. Project Categories Junction Table
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 3), (2, 3), (3, 3), (4, 1), (5, 2),
(6, 1), (7, 2), (8, 1), (9, 1), (10, 4),
(11, 4), (12, 3), (13, 2), (14, 3), (15, 4);









-- 1. Create the services table
CREATE TABLE IF NOT EXISTS public.service (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 2. Create the junction table linking project and service (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.project_service (
    project_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (project_id, service_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id) 
        REFERENCES public.project(project_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_service
        FOREIGN KEY (service_id) 
        REFERENCES public.service(service_id) 
        ON DELETE CASCADE
);

-- 3. Insert sample service data
INSERT INTO public.service (service_name, description) VALUES
('Debris Cleanup', 'Removal and clearing of fallen branches, trash, and storm debris.'),
('Tree Planting', 'Planting native trees and saplings in public park areas.'),
('Meal Distribution', 'Preparing and handing out warm meals to community members.'),
('Tutoring & Mentorship', 'Academic support and guidance for elementary students')
ON CONFLICT DO NOTHING;

-- 4. Associate services with existing projects (Example linking)
-- Assumes project_id 1 and service_ids 1, 2 exist
INSERT INTO public.project_service (project_id, service_id) VALUES
(1, 1),
(1, 2)
ON CONFLICT DO NOTHING;










-- Junction table linking projects to categories
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT NOT NULL REFERENCES public.project(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES public.categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Junction table linking projects to services
CREATE TABLE IF NOT EXISTS public.project_service (
    project_id INT NOT NULL REFERENCES public.project(project_id) ON DELETE CASCADE,
    service_id INT NOT NULL REFERENCES public.service(service_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, service_id)
);













-- ========================================
-- 5. Services Table
-- ========================================
CREATE TABLE IF NOT EXISTS services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT
);

-- Sample Data: Services offered across categories
INSERT INTO services (service_name, description) VALUES
    ('Accessibility & Construction', 'Building ramps, structural repairs, and physical assembly.'),
    ('Environmental Restoration', 'Tree planting, park cleanup, and habitat conservation.'),
    ('Sustainable Agriculture', 'Gardening, composting, greenhouse, and hydroponic setups.'),
    ('Educational Workshops', 'Tutoring, skill-building, and hands-on teaching sessions.'),
    ('Senior Care & Outreach', 'Health check-ins, social visitation, and support services.'),
    ('Food & Resource Assistance', 'Pantry drives, coat drives, and meal preparation for shelters.')
ON CONFLICT (service_name) DO NOTHING;


-- ========================================
-- 6. Project Services Junction Table (Many-to-Many)
-- ========================================
CREATE TABLE IF NOT EXISTS project_services (
    project_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (project_id, service_id),
    CONSTRAINT fk_ps_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_ps_service FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);

-- ========================================
-- Associate Services with Projects across Categories
-- ========================================
INSERT INTO project_services (project_id, service_id)
VALUES
    -- Projects linked to "Community Service" (Category ID 3)
    (1, 1), -- Community Center Ramp Installation -> Accessibility & Construction
    (2, 1), -- Affordable Housing Framing -> Accessibility & Construction
    (3, 1), -- Playground Restoration -> Accessibility & Construction
    (12, 6), -- Food Pantry Drive -> Food & Resource Assistance
    (14, 6), -- Clothing Drive -> Food & Resource Assistance

    -- Projects linked to "Environmental" (Category ID 1)
    (4, 2), -- Energy Efficient Insulation -> Environmental Restoration
    (6, 3), -- Neighborhood Garden Planting -> Sustainable Agriculture
    (8, 3), -- Composting Workshop -> Sustainable Agriculture
    (9, 2), -- Urban Orchard Tree Planting -> Environmental Restoration

    -- Projects linked to "Educational" (Category ID 2)
    (5, 4), -- Youth Workshop Buildout -> Educational Workshops
    (7, 3), -- Greenhouse Setup -> Sustainable Agriculture
    (7, 4), -- Greenhouse Setup -> Educational Workshops
    (13, 4), -- After-School Tutoring -> Educational Workshops

    -- Projects linked to "Health and Wellness" (Category ID 4)
    (10, 3), -- Vertical Hydroponics -> Sustainable Agriculture
    (11, 5), -- Senior Health Check -> Senior Care & Outreach
    (15, 6)  -- Holiday Meal Prep -> Food & Resource Assistance
ON CONFLICT DO NOTHING;


-- ========================================
-- Verification Query: Category Details Page Query
-- Checks Categories -> Projects -> Organizations -> Services
-- ========================================
SELECT 
    c.category_name,
    p.title AS project_title,
    p.date,
    p.location,
    o.name AS organization_name,
    COALESCE(STRING_AGG(s.service_name, ', '), 'No Services') AS services_provided
FROM categories c
JOIN project_categories pc ON c.category_id = pc.category_id
JOIN project p ON pc.project_id = p.project_id
JOIN organization o ON p.organization_id = o.organization_id
LEFT JOIN project_services ps ON p.project_id = ps.project_id
LEFT JOIN services s ON ps.service_id = s.service_id
GROUP BY c.category_name, p.project_id, o.name
ORDER BY c.category_name, p.date ASC;





SELECT 
    c.category_id,
    c.category_name,
    p.project_id,
    p.title AS project_title,
    p.description AS project_description,
    p.date AS project_date,
    p.location,
    o.name AS organization_name
FROM categories c
LEFT JOIN project_categories pc ON c.category_id = pc.category_id
LEFT JOIN project p ON pc.project_id = p.project_id
LEFT JOIN organization o ON p.organization_id = o.organization_id
ORDER BY c.category_name, p.date;





SELECT 
    c.category_id,
    c.category_name,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'project_id', p.project_id,
                'title', p.title,
                'description', p.description,
                'date', p.date,
                'location', p.location,
                'organization', o.name
            )
        ) FILTER (WHERE p.project_id IS NOT NULL), 
        '[]'::jsonb
    ) AS projects
FROM categories c
LEFT JOIN project_categories pc ON c.category_id = pc.category_id
LEFT JOIN project p ON pc.project_id = p.project_id
LEFT JOIN organization o ON p.organization_id = o.organization_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_name;






SELECT 
    p.project_id,
    p.title,
    p.description,
    p.date,
    p.location,
    o.name AS organization_name
FROM project p
JOIN project_categories pc ON p.project_id = pc.project_id
JOIN categories c ON pc.category_id = c.category_id
JOIN organization o ON p.organization_id = o.organization_id
WHERE c.category_name = 'Environmental'
ORDER BY p.date;





CREATE OR REPLACE VIEW view_category_projects AS
SELECT 
    c.category_id,
    c.category_name,
    p.project_id,
    p.title AS project_title,
    p.description AS project_description,
    p.date AS project_date,
    p.location,
    o.organization_id,
    o.name AS organization_name
FROM categories c
JOIN project_categories pc ON c.category_id = pc.category_id
JOIN project p ON pc.project_id = p.project_id
JOIN organization o ON p.organization_id = o.organization_id;

-- Usage:
SELECT * FROM view_category_projects WHERE category_name = 'Health and Wellness';



