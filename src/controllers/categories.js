import { getAllCategories } from '../models/categories.js';
import { getCategoryDetails, getProjectsByCategoryId } from '../models/projects.js';

// Controller to list all categories
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error rendering categories page:', error);
        req.flash('error', 'Unable to retrieve categories.');
        res.redirect('/');
    }
};

// Controller to render details and projects for a specific category
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Fetch category details and linked projects concurrently
        const [categoryDetails, projects] = await Promise.all([
            getCategoryDetails(categoryId),
            getProjectsByCategoryId(categoryId)
        ]);

        if (!categoryDetails) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }

        const title = `${categoryDetails.category_name} Details`;

        res.render('category', { 
            title, 
            categoryDetails, 
            projects: projects || [] 
        });
    } catch (error) {
        console.error('Error rendering category details page:', error);
        req.flash('error', 'Unable to retrieve category details.');
        res.redirect('/categories');
    }
};


const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};



// Unified export block
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};