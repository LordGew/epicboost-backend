const User = require("../models/User"); // Import the User model
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library 
const sendEmail = require("../middleware/sendEmail");

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

const forgotPassword = async(req, res ) =>{

    try{
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({msg:" User not found"});
        }

        //generar token
        const resetToken = crypto.randomBytes(32).toString('hex');
        // guardar el token en usurio / coleccion
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now()+ 60 * 60 * 1000;

        await user.save();

         // Construir enlace y mandar email
        const resetUrl = `http://localhost:5000/api/users/reset-password?token=${resetToken}`;

             await sendEmail(
                user.email,
                "Epic Boost password reset ",
                "Click to reset your Password ${resetUrl}",
                `
                      <html>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #000 url('https://kymz.xyz/img/fondo.png') no-repeat center center; background-size: cover;">
    <!-- Capa oscura para legibilidad -->
    <div style="background-color: rgba(0, 0, 0, 0.7); min-height: 100vh; padding: 30px; color: #fff;">

      <h1 style="text-align: center; margin-bottom: 10px; color: #66ccff;">Epic Boost</h1>
      <h2 style="text-align: center; margin-top: 0; font-style: italic;">Reset password</h2>

      <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px;">
        
        <p style="color: #cfcfcf; line-height: 1.6;">
          ¡Greetings, <strong style="color: #ffffff;">${user.f_name}</strong>!  
          We receive a request to reset yor password. Please, clic below to continue with process.
        </p>

        <!-- Sección con la tabla de acciones -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: rgba(255,255,255,0.05);">
          <tr>
            <th style="padding: 12px; border: 1px solid #333; text-align: left; color: #ffffff;">Action</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left; color: #ffffff;">Details</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333; color: #ffffff;">Reset Link</td>
            <td style="padding: 12px; border: 1px solid #333;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background-color: #66ccff; color: #000; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                 Click here to reset your password
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333; color: #ffffff;">Expiration</td>
            <td style="padding: 12px; border: 1px solid #333; color: #cfcfcf;">
              This link will expire in 1 hour
            </td>
          </tr>
        </table>

        <p style="margin-top: 20px; color: #bbbbbb; font-size: 14px; line-height: 1.5;">
          If you did not request a password reset, simply ignore this email. 
          <br />
          Still need support? contact us  <a href="mailto:contacto@kymz.xyz" style="color: #66ccff;">contacto@kymz.xyz</a>.
        </p>
      </div>

      <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
        &copy; 2025 Epic Boost. All rights reserved.
      </p>
    </div>
  </body>
</html>

                    `
            );

        return res.json({msg: "Mail already sent"});

        }catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error sending reset email' });
    
}};

const resetPassword = async (req, res) => {
    try{
        const {token, newPassword} = req.body;
        console.log("token: ", token);
        console.log("pass", newPassword);
        

        const user = await User.findOne({
        resetPasswordToken : token,
        resetPasswordExpire: {$gt: Date.now()},
        })

        if(!user){
            return res.status(400).json({msg: 'Invalid or expired token'})
        }

        //ENCRIPTAR NUEVA PASS
        user.password = await bcrypt.hash(newPassword, 10);

        //eliminar campos de reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()
        return res.json({ msg: "Password updated successfully" });

    }catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error' });
    
}};
module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
};
