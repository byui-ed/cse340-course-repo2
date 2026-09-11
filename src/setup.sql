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