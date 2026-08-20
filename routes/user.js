
const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLogedIn } = require("../middleware.js");

const userController =require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
    passport.authenticate("local",
        {failureRedirect: '/users/login',
        failureFlash:true
        }),
        userController.login
        );

    router.post(
     "/wishlist/:id",
     isLogedIn,
     wrapAsync(userController.toggleWishlist)
    );

    router.get(
    "/wishlist",
    isLogedIn,
    wrapAsync(userController.renderWishlist)
    );

router.get("/logout",userController.logout);

 module.exports =router;