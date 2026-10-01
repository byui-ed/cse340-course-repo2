import { getAllCategories } from '../models/categories.js';
import { getCategoryDetails, getProjectsByCategoryId } from '../models/projects.js';
import { getServicesByCategoryId } from '../models/categories.js';
import { updateCategory } from '../models/categories.js';
import { body, validationResult } from 'express-validator';
import { getCategoryById, } from '../models/categories.js';
import { createCategory } from '../models/categories.js';




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


const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }

        // Fetch services and projects for this category
        const services = await getServicesByCategoryId(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category-details', { 
            title: category.category_name, 
            category, 
            services, 
            projects 
        });
    } catch (error) {
        console.error('Error loading category details:', error);
        req.flash('error', 'Unable to load category details.');
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




// Express-Validator rules
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty()
        .withMessage('Category name cannot be empty.')
        .isLength({ min: 2, max: 100 })
        .withMessage('Category name must be between 2 and 100 characters.')
];

// GET: Render Edit Category Form
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }

        res.render('edit-category', { 
            title: `Edit ${category.category_name}`, 
            category 
        });
    } catch (error) {
        console.error('Error rendering edit category form:', error);
        req.flash('error', 'Unable to load edit page.');
        res.redirect('/categories');
    }
};

// POST: Process Edit Category Form Submission
const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    const categoryId = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/category/edit/${categoryId}`);
    }

    try {
        const { categoryName } = req.body;
        await updateCategory(categoryId, categoryName);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'Failed to update category.');
        res.redirect(`/category/edit/${categoryId}`);
    }
};








// GET: Display Add New Category Form
const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

// POST: Process New Category Submission
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    try {
        const { categoryName } = req.body;
        await createCategory(categoryName);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'Failed to create category.');
        res.redirect('/new-category');
    }
};








// Unified export block
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showEditCategoryForm,
    processEditCategoryForm, 
    showNewCategoryForm, 
    processNewCategoryForm, 
    categoryValidation
};