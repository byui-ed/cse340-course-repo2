// Import any needed model functions
import { getAllCategories, getCategoryDetails } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const title = 'Category Details';

    res.render('category', { title, categoryDetails });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };