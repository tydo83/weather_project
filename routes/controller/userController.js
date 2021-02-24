const bcrypt = require('bcryptjs');
const User = require("../model/User");

module.exports = {
    signup: async (req, res) => {
        
        const { firstName, lastName, email, password } = req.body

        try {
            const salted = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salted);

            const createdUser = new User({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password: hashedPassword,
            });

            let savedUser = await createdUser.save();

            // res.status(200).json({
            //     message: "success",
            //     user: savedUser,
            // })
            res.render("sign-up", { success: true })
        } 
        catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    
    login: async (req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email });
            if (!foundUser) {
                res.render('sign-up', {
                    error: {
                        message: "User doesn't exist", 
                    }
                    });
                // res.render("login", {error:null, error2: true, error3: null, success:null})
                // res.status(404).json({
                //     message: "failure",
                // });
            } else {
                let isPasswordTrue = await bcrypt.compare(
                    req.body.password,
                    foundUser.password
                );
                if (isPasswordTrue) {
                    req.session.user = {
                        _id: foundUser._id,
                        email: foundUser.email,
                    }
                    res.redirect("/users/home")
                    // res.render("home", { user: foundUser.email })
                } else {
                    res.render("login", {
                        error: {
                            message: "please check your email and password"
                        }
                    })
                    // res.status(500).json({
                    //     message: "failure",
                    //     successMessage: "please check your email and password",
                    // });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            });
        }
    }
}