const express = require("express");
const {registerUser, loginUser, forgotPassword, resetPassword} = require("../controller/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);
// routes/userRoutes.js (o donde definas tus rutas)
router.get("/reset-password", (req, res) => {
    // Extraer el token de req.query.token
    const { token } = req.query;
    //res.redirect(`http://localhost:4200/reset-password?token=${token}`);
    // Renderizar una vista HTML o devolver un simple mensaje
    res.send(`
      <html>
        <body>
          <h1>Reset Password</h1>
          <form method="POST" action="http://localhost:5000/api/users/reset-password">
            <input type="hidden" name="token" value="${token}" />
            <label>New Password:</label>
            <input type="password" name="newPassword" />
            <button type="submit">Change Password</button>
          </form>
        </body>
      </html>
    `);
  });
  

module.exports = router;