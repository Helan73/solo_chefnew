const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const path = require('path');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();



const port = process.env.PORT || 3000;

const userSchema = require('./server/models/User.js');
app.use(fileUpload());

app.use(cookieParser('SoloChefSecure'));
app.use(session({
    secret: 'SoloChefSecretSession',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false }
}));
app.use(flash());

require('dotenv').config();

//convert userdata into json method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//for routing purpose
const User = require('./server/models/User.js');


app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/signup", async (req, res) => {

    let imageUploadfile;
    let uploadPath;
    let newImageName;
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded');
    }
    else {
        imageUploadfile = req.files.image;
        newImageName = Date.now() + imageUploadfile.name;
        uploadPath = path.resolve('./') + '/public/img/' + newImageName;
        if (imageUploadfile) {
            try {
                await imageUploadfile.mv(uploadPath);
            } catch (err) {
                return res.status(500).send(err);
            }
        }

        const data = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            image: newImageName
        }
        //check if the user is already existed
        const existUser = await userSchema.findOne({ email: data.email });
        if (existUser) {
            res.send("User already existed.Please try a different email!.");
        }
        else {
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashPassword;
            const userdata = await userSchema.insertMany(data);
            res.render("login");
        }
    }

});
//user login
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ email: req.body.email });
        if (!check) {
            return res.send("User email cannot be found. Please signup!.");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.user = check;
            //   console.log("Session user set:", req.session.user); // Debugging statement
            res.redirect('/user-details');
        } else {
            res.send("Wrong password.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.send("An error occurred.");
    }
});

app.get('/user-details', async (req, res) => {
    try {
        if (req.session.user) {
            // const userId = req.session.user.id; // Assuming you have access to the authenticated user's ID
            // const user = await User.findById(userId).populate('createdRecipes');
            
            // const recipe = await Recipe.findById(recipe);
            
            res.render('user-details', { user: req.session.user });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('An error occurred');
    }
});
app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/'); // Redirect to login page after logout
    });
});
app.get('/about', (req, res) => {
    res.render('about', { title: "About Us" });
});
//for recipe starts here
const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, () => console.log(`Listening to the port ${port}`));