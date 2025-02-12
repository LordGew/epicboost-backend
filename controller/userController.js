const User = require("../models/User"); // Import the User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library 

//Register a new user
const registerUser = async(req, res) => {
   const {f_name,l_name, email, password, avatar} = req.body; // Destructure the request body to get the user data
   try{
    let user = await User.findOne({email}); // Check if the user already exists in the database by email
    if(user) return res.status(400).json({msg: "User already exists"}); // If the user exists, return a 400 status code and a message


    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt of 10 rounds
    user = new User ({f_name,l_name, email, password: hashedPassword, avatar}); // Create a new user object with the hashed password and the other user data
    await user.save(); // Save the user to the database

    res.json({msg: "User registered successfully"}); // Return a success message    


    }catch(err){ // If there is an error, return a 500 status code and the error message
        console.error(err.message);
        res.status(500).send("Server error");
    }

};


//Login a user
const loginUser = async(req, res) => {
    const {email, password} = req.body; // Destructure the request body to get the user data
    try{
        let user = await User.findOne({email}); // Check if the user exists in the database by email
        if(!user) return res.status(400).json({msg: "Invalid credentials"}); // If the user does not exist, return a 400 status code and a message

        const isMatch = await bcrypt.compare(password, user.password); // Compare the password with the hashed password in the database using bcrypt
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials"}); // If the passwords do not match, return a 400 status code and a message

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"}); // Create a jsonwebtoken with the user id and the secret key from the environment variables and set the expiration time to 1 hour
        res.json({token, user: {id: user._id, f_name: user.f_name, l_name: user.l_name, email: user.email, avatar: user.avatar}}); // Return the token and the user data

        
    }catch(err){
        res.status(500).json({msg: "Server error"}); // If there is an error, return a 500 status code and the error message    
    }
}; // This function will be implemented later


module.exports = {
    registerUser,
    loginUser
};
