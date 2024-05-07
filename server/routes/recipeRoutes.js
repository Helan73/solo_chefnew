const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');


router.get('/index', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/created-recipes',recipeController.createdRecipes);
router.get('/edit',recipeController.editPage);
router.post('/edit',recipeController.editDetails);
router.post('/save',recipeController.saveRecipe);
router.get('/saved-recipes',recipeController.savedRecipes);

module.exports=router;