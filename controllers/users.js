const User=require("../models/user");
const Listing = require("../models/listing");

//render signup form
module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//signUp
module.exports.signUp=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registerdUser=await User.register(newUser,password);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcom to Wanderlust!");
             res.redirect("/listings");
        });

        }catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }
};

//render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  res.redirect("/listings");   
};

//logout-
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success"," you are logged out!");
        res.redirect("/listings");
    });
};

// wishlist

module.exports.renderWishlist = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("users/wishlist", {
        wishlist: user.wishlist,
    });

};

// Toggle Wishlist
module.exports.toggleWishlist = async (req, res) => {


    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const exists = user.wishlist.some(
        (item) => item.toString() === id
    );

    if (exists) {
        // Remove from wishlist
        user.wishlist.pull(id);
    } else {
        // Add to wishlist
        user.wishlist.push(id);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id);

    console.log("Wishlist =>", updatedUser.wishlist);

    // AJAX Request
        if (
            req.xhr ||
            (req.headers.accept &&
             req.headers.accept.includes("application/json"))
        ) {

             return res.json({
             success: true,
            wishlisted: !exists,
        });

}

// Normal Request
    const redirectUrl = req.body.redirect || "/listings";
    res.redirect(redirectUrl);
};

