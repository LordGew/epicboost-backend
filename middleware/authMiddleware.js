const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Verificar que el header Authorization existe y que empieza con 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    console.log("Headers:", req.headers);

    try {
      // Extraer el token del header
      token = req.headers.authorization.split(" ")[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario y guardar en req.user
      req.user = await User.findById(decoded.id).select("-password");

      // Continuar con la siguiente función
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: "Token inválido" });
    }
  } else {
    return res.status(401).json({ msg: "No token found" });
  }
};



const isAdmin = (req, res, next) => {
 try{
  if(!req.user){return res.status(401).json({msg: "Need to be authenticated "})};

  if(req.user.role !== "admin"){return res.status(401).json({msg: "You dot not a admin"})};
  next();
 } catch(error){
  console.log(error);
  return res.status(500).json({msg: "Server error"});
 }
};




module.exports = {
  protect, 
  isAdmin
};
