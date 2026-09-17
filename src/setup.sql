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