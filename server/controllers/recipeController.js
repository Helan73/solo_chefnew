require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require('bcrypt');
/***Get
 * homepage
 * 
 */
exports.homepage = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error should be removed ..*/
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(limitNumber);
    const indian = await Recipe.find({ 'category': 'Indian' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    const spanish = await Recipe.find({ 'category': 'Spanish' }).limit(limitNumber);



    const food = { latest, thai, american, mexican, indian, chinese, spanish };




    res.render('index', { titile: 'Solo-Chef:Your culinary companion', categories, food });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}
/***Get
 *  Categories
 * 
 */
exports.exploreCategories = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render('categories', { titile: 'Solo-Chef:Categories', categories });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}


/***Get
 *  Categories/:id
 * 
 */
exports.exploreCategoriesById = async (req, res) => {
  try {

    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);

    res.render('categories', { titile: 'Solo-Chef:Categories', categoryById });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}


/***Get/recipe:id
 *  recipe
 * 
 */
exports.exploreRecipe = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render('recipe', { titile: 'Solo-Chef:Recipe', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}

/***post/search
*  Search
* 
*/
exports.searchRecipe = async (req, res) => {
  //searchTerm
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { titile: 'Solo-Chef:Search', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }


}


/***Get/exploreLatest
 *  exploreLatest
 * 
 */
exports.exploreLatest = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

    res.render('explore-latest', { titile: 'Solo-Chef:Explore Latest', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}



/***Get/exploreRandom
 *  exploreRandom
 * 
 */
exports.exploreRandom = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { titile: 'Solo-Chef:Explore Random', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}


/***Get/Create-recipe
*  submitRecipe
* 
*/
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('InfoErrors');
  const infoSubmitObj = req.flash('InfoSubmit');
  res.render('submit-recipe', { titile: 'Solo-Chef:Submit Recipe', infoErrorsObj, infoSubmitObj });

}



/***Get/Create-recipe/post
 *  submitRecipe
 * 
 */
exports.submitRecipeOnPost = async (req, res) => {

  try {

    let imageUploadfile;
    let uploadPath;
    let newImageName;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
    }
    else {
      imageUploadfile = req.files.image;
      newImageName = Date.now() + imageUploadfile.name;
      uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
      imageUploadfile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      cookingtime: req.body.cookingtime,
      ingredients: req.body.ingredients,
      instruction: req.body.instruction,
      category: req.body.category,
      image: newImageName

    });
    await newRecipe.save();
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    user.createdRecipes.push(newRecipe._id);
    await user.save();

    req.flash('InfoSubmit', 'Recipe has been added.');


    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER, //sender email
        pass: process.env.APP_PASSWORD,
      },
    });
    const mailOptions = {
      from: {
        name: 'Solo-Chef',
        address: process.env.USER
      },
      to: user.email,
      subject: "Your Recipe has been added✔..Thank you for adding your recipe! We're thrilled to have it as part of our collection at Solo-Chef, we're passionate about creating and sharing delicious recipes with our community. Your contribution is greatly appreciated, and we look forward to creating more culinary delights together. Your recipes not only enrich our platform but also inspire others to explore new flavors and techniques in the kitchen.As we embark on this culinary journey together, we wish you the best day filled with creativity and delicious discoveries. Thank you for being part of the Solo-Chef community!",
      text: "Hello ..",
      html: "<b>Hello..</b>",
    }
    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log('mail has been sent');
      }
      catch (error) {
        console.error(error);
      }
    }
    sendMail(transporter, mailOptions);

    res.redirect('/submit-recipe');
  }

  catch (error) {
    //res.json(error);
    req.flash('InfoErrors', error);
    res.redirect('/submit-recipe');

  }

}
exports.createdRecipes = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const recipeIds = req.session.user.createdRecipes;
    const user = await User.findById(userId);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });
    res.render('created-recipes', { titile: 'Solo-Chef:Created Recipes', user, recipes });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Internal Server Error');
  }
}
exports.editPage = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  res.render('edit', { user });
}
exports.editDetails = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  try {
    let newImageName = null;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
    } else {
      const imageUploadfile = req.files.image;
      newImageName = Date.now() + imageUploadfile.name;
      const uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
      imageUploadfile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }
    const { email, name, password, newPassword } = req.body;
    const updatedFields = {};
    if (email) updatedFields.email = email;
    if (name) updatedFields.name = name;
    if (newImageName) updatedFields.image = newImageName;

    // Check if the current password is correct
    const isPasswordCorrect = await User.comparePassword(password, user.password);
    console.log('Provided password:', password);
    console.log('Stored hashed password:', user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
  console.log(newPassword);
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    // Hash the new password before updating
    const saltRounds = 10; 
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    updatedFields.password = hashedNewPassword;

    // Update the user with the new fields
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.redirect('/logout'); 
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// savedrecipe post

exports.saveRecipe = async (req, res) => {
  try {
    const recipeId = req.body.recipeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      await user.save();
      res.redirect('back');
    }
    else {
      res.send("You already saved this recipe");
    }


  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.savedRecipes = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const recipeIds = req.session.user.savedRecipes;
  const recipes = await Recipe.find({ _id: { $in: recipeIds } });
  res.render('saved-recipes', { titile: 'Solo-Chef:Created Recipes', user, recipes });
}